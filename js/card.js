/**
 * Physical card renderer. Content and colors come from data/card.js.
 * The dependency-free QR encoder creates byte-mode QR codes at level L.
 */

const card = document.querySelector('[data-physical-card]');
const portraitCard = document.querySelector('[data-portrait-card]');
const status = document.querySelector('[data-card-status]');
const printButton = document.querySelector('[data-print-card]');

const QR_BLOCKS = [
  null,
  [[1, 26, 19]],
  [[1, 44, 34]],
  [[1, 70, 55]],
  [[1, 100, 80]],
  [[1, 134, 108]],
  [[2, 86, 68]],
  [[2, 98, 78]],
  [[2, 121, 97]],
  [[2, 146, 116]],
  [[2, 86, 68], [2, 87, 69]],
];

const ALIGNMENT_CENTERS = [
  null,
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

const gfExp = new Array(512);
const gfLog = new Array(256);
let gfValue = 1;
for (let index = 0; index < 255; index += 1) {
  gfExp[index] = gfValue;
  gfLog[gfValue] = index;
  gfValue <<= 1;
  if (gfValue & 0x100) gfValue ^= 0x11d;
}
for (let index = 255; index < 512; index += 1) gfExp[index] = gfExp[index - 255];

function multiply(left, right) {
  if (left === 0 || right === 0) return 0;
  return gfExp[gfLog[left] + gfLog[right]];
}

function polynomialMultiply(left, right) {
  const result = new Array(left.length + right.length - 1).fill(0);
  left.forEach((leftValue, leftIndex) => {
    right.forEach((rightValue, rightIndex) => {
      result[leftIndex + rightIndex] ^= multiply(leftValue, rightValue);
    });
  });
  return result;
}

function errorCorrection(data, length) {
  let generator = [1];
  for (let index = 0; index < length; index += 1) {
    generator = polynomialMultiply(generator, [1, gfExp[index]]);
  }

  const remainder = new Array(length).fill(0);
  data.forEach((byte) => {
    const factor = byte ^ remainder[0];
    remainder.shift();
    remainder.push(0);
    if (factor === 0) return;
    generator.slice(1).forEach((coefficient, index) => {
      remainder[index] ^= multiply(coefficient, factor);
    });
  });
  return remainder;
}

function appendBits(bits, value, length) {
  for (let shift = length - 1; shift >= 0; shift -= 1) bits.push((value >>> shift) & 1);
}

function createCodewords(text) {
  const bytes = [...new TextEncoder().encode(text)];
  let version = 1;

  for (; version < QR_BLOCKS.length; version += 1) {
    const dataCapacity = QR_BLOCKS[version]
      .reduce((total, [count, , dataCount]) => total + (count * dataCount), 0);
    const countBits = version < 10 ? 8 : 16;
    if (4 + countBits + (bytes.length * 8) <= dataCapacity * 8) break;
  }

  if (version >= QR_BLOCKS.length) {
    throw new Error('The destination URL is too long. Use a URL shorter than 272 bytes.');
  }

  const definitions = QR_BLOCKS[version];
  const dataCapacity = definitions.reduce(
    (total, [count, , dataCount]) => total + (count * dataCount),
    0,
  );
  const bits = [];
  appendBits(bits, 0b0100, 4);
  appendBits(bits, bytes.length, version < 10 ? 8 : 16);
  bytes.forEach((byte) => appendBits(bits, byte, 8));

  const remaining = (dataCapacity * 8) - bits.length;
  appendBits(bits, 0, Math.min(4, remaining));
  while (bits.length % 8) bits.push(0);

  const data = [];
  for (let index = 0; index < bits.length; index += 8) {
    data.push(Number.parseInt(bits.slice(index, index + 8).join(''), 2));
  }
  let padIndex = 0;
  while (data.length < dataCapacity) {
    data.push(padIndex % 2 === 0 ? 0xec : 0x11);
    padIndex += 1;
  }

  const dataBlocks = [];
  const errorBlocks = [];
  let offset = 0;
  definitions.forEach(([count, totalCount, dataCount]) => {
    for (let block = 0; block < count; block += 1) {
      const dataBlock = data.slice(offset, offset + dataCount);
      dataBlocks.push(dataBlock);
      errorBlocks.push(errorCorrection(dataBlock, totalCount - dataCount));
      offset += dataCount;
    }
  });

  const codewords = [];
  const longestDataBlock = Math.max(...dataBlocks.map((block) => block.length));
  const longestErrorBlock = Math.max(...errorBlocks.map((block) => block.length));
  for (let index = 0; index < longestDataBlock; index += 1) {
    dataBlocks.forEach((block) => {
      if (index < block.length) codewords.push(block[index]);
    });
  }
  for (let index = 0; index < longestErrorBlock; index += 1) {
    errorBlocks.forEach((block) => codewords.push(block[index]));
  }

  return { version, codewords };
}

function bchRemainder(value, polynomial) {
  function degree(number) {
    let result = 0;
    while (number) {
      result += 1;
      number >>>= 1;
    }
    return result;
  }

  const polynomialDegree = degree(polynomial);
  while (degree(value) >= polynomialDegree) {
    value ^= polynomial << (degree(value) - polynomialDegree);
  }
  return value;
}

function placeFinder(matrix, row, column) {
  for (let rowOffset = -1; rowOffset <= 7; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 7; columnOffset += 1) {
      const targetRow = row + rowOffset;
      const targetColumn = column + columnOffset;
      if (!matrix[targetRow] || targetColumn < 0 || targetColumn >= matrix.length) continue;
      const inside = rowOffset >= 0 && rowOffset <= 6 && columnOffset >= 0 && columnOffset <= 6;
      const dark = inside && (
        rowOffset === 0 || rowOffset === 6 || columnOffset === 0 || columnOffset === 6
        || (rowOffset >= 2 && rowOffset <= 4 && columnOffset >= 2 && columnOffset <= 4)
      );
      matrix[targetRow][targetColumn] = dark;
    }
  }
}

function placeFormatInformation(matrix, mask) {
  const size = matrix.length;
  const data = (1 << 3) | mask;
  const format = ((data << 10) | bchRemainder(data << 10, 0x537)) ^ 0x5412;

  for (let index = 0; index < 15; index += 1) {
    const dark = ((format >>> index) & 1) === 1;
    if (index < 6) matrix[index][8] = dark;
    else if (index < 8) matrix[index + 1][8] = dark;
    else matrix[size - 15 + index][8] = dark;

    if (index < 8) matrix[8][size - index - 1] = dark;
    else if (index === 8) matrix[8][7] = dark;
    else matrix[8][15 - index - 1] = dark;
  }
  matrix[size - 8][8] = true;
}

function createMatrix(text) {
  const { version, codewords } = createCodewords(text);
  const size = 17 + (version * 4);
  const matrix = Array.from({ length: size }, () => new Array(size).fill(null));
  placeFinder(matrix, 0, 0);
  placeFinder(matrix, size - 7, 0);
  placeFinder(matrix, 0, size - 7);

  ALIGNMENT_CENTERS[version].forEach((row) => {
    ALIGNMENT_CENTERS[version].forEach((column) => {
      if (matrix[row][column] !== null) return;
      for (let rowOffset = -2; rowOffset <= 2; rowOffset += 1) {
        for (let columnOffset = -2; columnOffset <= 2; columnOffset += 1) {
          matrix[row + rowOffset][column + columnOffset] = Math.max(
            Math.abs(rowOffset),
            Math.abs(columnOffset),
          ) !== 1;
        }
      }
    });
  });

  for (let index = 8; index < size - 8; index += 1) {
    if (matrix[index][6] === null) matrix[index][6] = index % 2 === 0;
    if (matrix[6][index] === null) matrix[6][index] = index % 2 === 0;
  }

  if (version >= 7) {
    const versionBits = (version << 12) | bchRemainder(version << 12, 0x1f25);
    for (let index = 0; index < 18; index += 1) {
      const dark = ((versionBits >>> index) & 1) === 1;
      matrix[Math.floor(index / 3)][(index % 3) + size - 11] = dark;
      matrix[(index % 3) + size - 11][Math.floor(index / 3)] = dark;
    }
  }

  placeFormatInformation(matrix, 0);

  const bits = [];
  codewords.forEach((byte) => appendBits(bits, byte, 8));
  let bitIndex = 0;
  let row = size - 1;
  let direction = -1;
  for (let column = size - 1; column > 0; column -= 2) {
    if (column === 6) column -= 1;
    while (true) {
      for (let offset = 0; offset < 2; offset += 1) {
        const targetColumn = column - offset;
        if (matrix[row][targetColumn] !== null) continue;
        const value = bitIndex < bits.length ? bits[bitIndex] === 1 : false;
        matrix[row][targetColumn] = ((row + targetColumn) % 2 === 0) ? !value : value;
        bitIndex += 1;
      }
      row += direction;
      if (row >= 0 && row < size) continue;
      row -= direction;
      direction *= -1;
      break;
    }
  }

  return matrix;
}

function renderQrCode(text) {
  const matrix = createMatrix(text);
  const quietZone = 4;
  const size = matrix.length + (quietZone * 2);
  const path = [];
  matrix.forEach((row, rowIndex) => {
    row.forEach((dark, columnIndex) => {
      if (dark) path.push(`M${columnIndex + quietZone} ${rowIndex + quietZone}h1v1h-1z`);
    });
  });

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="QR code for ${text.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}">
      <rect width="${size}" height="${size}" fill="#fff"/>
      <path d="${path.join('')}" fill="#000"/>
    </svg>
  `;
}

function setText(root, selector, value) {
  const target = root.querySelector(selector);
  if (target) target.textContent = value;
}

function renderConfiguredCard(root, configuration, destination) {
  setText(root, '[data-card-brand]', configuration.brand);
  setText(root, '[data-card-headline]', configuration.headline);
  setText(root, '[data-card-prompt]', configuration.prompt);
  setText(root, '[data-card-qr-label]', configuration.qrLabel);
  setText(root, '[data-card-display-url]', configuration.displayUrl);
  root.style.setProperty('--card-foreground', configuration.foregroundColor);
  root.style.setProperty('--card-background', configuration.backgroundColor);
  root.style.setProperty('--card-accent', configuration.accentColor);

  const artwork = root.querySelector('[data-card-artwork]');
  if (configuration.artwork) {
    artwork.src = configuration.artwork;
    artwork.alt = configuration.artworkAlt || '';
    artwork.hidden = false;
  }

  root.querySelector('[data-card-qr]').innerHTML = renderQrCode(destination.toString());
  root.setAttribute('aria-busy', 'false');
}

function renderCard(configuration) {
  const destination = new URL(configuration.destinationUrl);
  if (!['http:', 'https:'].includes(destination.protocol)) {
    throw new Error('The destination URL must use HTTP or HTTPS.');
  }

  renderConfiguredCard(card, configuration, destination);
  renderConfiguredCard(portraitCard, configuration, destination);
  status.textContent = 'Card ready. Print at 100% scale for an 85.60 × 53.98 mm card.';
}

printButton?.addEventListener('click', () => window.print());

if (window.dateMeCardConfig) {
  try {
    renderCard(window.dateMeCardConfig);
  } catch (error) {
    card.setAttribute('aria-busy', 'false');
    portraitCard.setAttribute('aria-busy', 'false');
    status.textContent = `Card unavailable: ${error.message}`;
  }
} else {
  card.setAttribute('aria-busy', 'false');
  portraitCard.setAttribute('aria-busy', 'false');
  status.textContent = 'Card unavailable: configuration could not be loaded.';
}
