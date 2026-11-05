const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const orderForm = document.querySelector('#order-form');
const orderNote = document.querySelector('#order-note');
const orderProductSelect = document.querySelector('#order-product');
const orderQuantitySelect = document.querySelector('#order-quantity');
const orderTotal = document.querySelector('#order-total');
const customizeForm = document.querySelector('#customize-form');
const customTextInput = document.querySelector('#custom-text');
const customColorSelect = document.querySelector('#custom-color');
const customColorPicker = document.querySelector('#custom-color-picker');
const customQuantitySelect = document.querySelector('#custom-quantity');
const customPriceNote = document.querySelector('#custom-price-note');
const designSummary = document.querySelector('#design-summary');
const designImageFile = document.querySelector('#design-image-file');
const designImageSizeInput = document.querySelector('#design-image-size');
const designImageSizeValue = document.querySelector('#design-image-size-value');
const removeDesignImageButton = document.querySelector('#remove-design-image');
const imageStatus = document.querySelector('#image-status');
const customizeNote = document.querySelector('#customize-note');
const keychainCanvas = document.querySelector('#keychain-canvas');
const rotationInput = document.querySelector('#keychain-rotation');
const rotationValue = document.querySelector('#rotation-value');
const tiltInput = document.querySelector('#keychain-tilt');
const tiltValue = document.querySelector('#tilt-value');
const drawingColor = document.querySelector('#drawing-color');
const drawingSize = document.querySelector('#drawing-size');
const drawingSizeValue = document.querySelector('#drawing-size-value');
const motifSizeInput = document.querySelector('#motif-size');
const motifSizeValue = document.querySelector('#motif-size-value');
const designTextColor = document.querySelector('#design-text-color');
const designFont = document.querySelector('#design-font');
const designTextSize = document.querySelector('#design-text-size');
const designTextSizeValue = document.querySelector('#design-text-size-value');
const designTextPosition = document.querySelector('#design-text-position');
const designTextPositionValue = document.querySelector('#design-text-position-value');
const toolHelp = document.querySelector('#tool-help');
const designerStatus = document.querySelector('#designer-status');
const yearNode = document.querySelector('#year');

const productPrices = {
  'Porte-clés': { 1: 350, 2: 600, 5: 1100 },
  Collier: { 1: 500, 2: 800, 5: 1500 },
  'Offre duo': { 1: 1400 },
};
const euroFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

function getBundlePrice(product, quantity) {
  const bundles = productPrices[product];
  if (!bundles || !Number.isInteger(quantity) || quantity < 1 || quantity > 15) return null;

  const lowestPrices = Array(quantity + 1).fill(Number.POSITIVE_INFINITY);
  lowestPrices[0] = 0;

  for (let count = 1; count <= quantity; count += 1) {
    Object.entries(bundles).forEach(([bundleSize, price]) => {
      const size = Number(bundleSize);
      if (size <= count) {
        lowestPrices[count] = Math.min(lowestPrices[count], lowestPrices[count - size] + price);
      }
    });
  }

  return Number.isFinite(lowestPrices[quantity]) ? lowestPrices[quantity] : null;
}

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Ouvrir le menu');
    });
  });
}

document.querySelectorAll('.product-link[data-product]').forEach((link) => {
  link.addEventListener('click', () => {
    const productSelect = document.querySelector('#order-product');
    const quantitySelect = document.querySelector('#order-quantity');
    if (productSelect) {
      productSelect.value = link.dataset.product;
    }
    if (quantitySelect && link.dataset.quantity) quantitySelect.value = link.dataset.quantity;
    updateOrderTotal();
  });
});

function updateOrderTotal() {
  if (!orderProductSelect || !orderQuantitySelect || !orderTotal) return;
  const quantity = Number(orderQuantitySelect.value);
  const price = getBundlePrice(orderProductSelect.value, quantity);
  const unitLabel =
    orderProductSelect.value === 'Offre duo'
      ? quantity === 1 ? '1 offre duo' : `${quantity} offres duo`
      : `${quantity} ${orderProductSelect.value.toLocaleLowerCase('fr-FR')}${orderProductSelect.value === 'Collier' && quantity > 1 ? 's' : ''}`;
  orderTotal.textContent = price === null
    ? 'Choisis un produit pour voir le prix.'
    : `Total : ${euroFormatter.format(price / 100)} (prix indicatif pour ${unitLabel})`;
}

if (orderProductSelect && orderQuantitySelect && orderTotal) {
  orderProductSelect.addEventListener('change', updateOrderTotal);
  orderQuantitySelect.addEventListener('change', updateOrderTotal);
  updateOrderTotal();
}

if (orderForm && orderNote && orderProductSelect && orderQuantitySelect) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!orderForm.reportValidity()) return;

    const formData = new FormData(orderForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const product = String(formData.get('product') || '').trim();
    const quantity = String(formData.get('quantity') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const price = getBundlePrice(product, Number(quantity));
    if (price === null) return;
    const quantityDescription =
      product === 'Offre duo'
        ? `${quantity} offre(s) duo (${Number(quantity) * 2} porte-clés et ${Number(quantity) * 2} colliers)`
        : `${quantity} ${product.toLocaleLowerCase('fr-FR')}${product === 'Collier' && Number(quantity) > 1 ? 's' : ''}`;
    const subject = encodeURIComponent(`Demande de commande SKYCRAFT — ${product}`);
    const body = encodeURIComponent(
      `Nom : ${name}\nE-mail : ${email}\nProduit : ${product}\nQuantité : ${quantityDescription}\nTotal indicatif : ${euroFormatter.format(price / 100)}\n\nPrécisions :\n${message}`
    );

    orderNote.textContent = 'Ton application de messagerie va s’ouvrir avec les détails de ta demande. Envoie l’e-mail pour la transmettre.';
    window.location.href = `mailto:clem.diet57@gmail.com?subject=${subject}&body=${body}`;
  });
}

if (
  customizeForm &&
  customTextInput &&
  customColorSelect &&
  customQuantitySelect &&
  customPriceNote &&
  customizeNote &&
  keychainCanvas &&
  rotationInput &&
  rotationValue &&
  tiltInput &&
  tiltValue &&
  drawingColor &&
  drawingSize &&
  drawingSizeValue &&
  motifSizeInput &&
  motifSizeValue &&
  designTextColor &&
  designFont &&
  designTextSize &&
  designTextSizeValue &&
  designTextPosition &&
  designTextPositionValue &&
  toolHelp &&
  customColorPicker &&
  designerStatus &&
  designImageFile &&
  designImageSizeInput &&
  designImageSizeValue &&
  removeDesignImageButton &&
  imageStatus
) {
  const context = keychainCanvas.getContext('2d');
  const canvasCenter = { x: keychainCanvas.width / 2, y: keychainCanvas.height / 2 };
  const bodyBounds = { centerX: 0, centerY: 10, radius: 90 };
  const keychainColors = {
    vert: '#4b8260',
    bleu: '#5482b0',
    rose: '#ce7893',
    jaune: '#d3a93d',
    violet: '#9063a8',
    orange: '#df8747',
    noir: '#313936',
    blanc: '#e8e9df',
  };
  const keychainColorNames = {
    vert: 'Vert',
    bleu: 'Bleu',
    rose: 'Rose',
    jaune: 'Jaune',
    violet: 'Violet',
    orange: 'Orange',
    noir: 'Noir',
    blanc: 'Blanc',
  };
  const ringColors = {
    silver: '#aeb8b2',
    gold: '#d2a84e',
    'rose-gold': '#c98e75',
  };
  const design = [];
  let rotationY = 0;
  let rotationX = 0;
  let bodyShape = 'round';
  let ringColor = 'silver';
  let bodyCustomColor = null;
  let textX = 0;
  let textY = 0;
  let importedImageData = null;
  let importedImage = null;
  let imageX = 0;
  let imageY = 0;
  let imageSize = 84;
  let activeTool = 'draw';
  let activeStroke = null;
  let activeRotation = null;
  let activeMove = null;
  let autosaveTimer = 0;
  const history = [];
  let historyIndex = -1;

  function createSnapshot() {
    return JSON.stringify({
      design,
      rotationY,
      rotationX,
      bodyShape,
      ringColor,
      bodyCustomColor,
      textX,
      textY,
      importedImageData,
      imageX,
      imageY,
      imageSize,
      bodyColor: customColorSelect.value,
      quantity: Number(customQuantitySelect.value),
      text: customTextInput.value,
      drawingColor: drawingColor.value,
      drawingSize: Number(drawingSize.value),
      motifSize: Number(motifSizeInput.value),
      textColor: designTextColor.value,
      font: designFont.value,
      textSize: Number(designTextSize.value),
      textPosition: Number(designTextPosition.value),
    });
  }

  function updateHistoryButtons() {
    document.querySelector('#undo-design').disabled = historyIndex <= 0;
    document.querySelector('#redo-design').disabled = historyIndex >= history.length - 1;
  }

  function recordHistory() {
    const snapshot = createSnapshot();
    if (history[historyIndex] === snapshot) return;
    history.splice(historyIndex + 1);
    history.push(snapshot);
    if (history.length > 80) history.shift();
    historyIndex = history.length - 1;
    updateHistoryButtons();
    scheduleAutosave();
  }

  async function restoreSnapshot(snapshot) {
    const state = JSON.parse(snapshot);
    const restoredImage = state.importedImageData
      ? await decodeImportedImage(state.importedImageData)
      : null;
    design.splice(0, design.length, ...state.design);
    rotationY = state.rotationY;
    rotationX = state.rotationX;
    bodyShape = state.bodyShape || 'round';
    ringColor = state.ringColor || 'silver';
    bodyCustomColor = state.bodyCustomColor || null;
    textX = state.textX || 0;
    textY = state.textY || 0;
    importedImageData = state.importedImageData || null;
    importedImage = restoredImage;
    imageX = state.imageX || 0;
    imageY = state.imageY || 0;
    imageSize = state.imageSize || 84;
    customColorSelect.value = state.bodyColor;
    customColorPicker.value = bodyCustomColor || keychainColors[state.bodyColor];
    if (Number.isInteger(state.quantity) && state.quantity >= 1 && state.quantity <= 15) {
      customQuantitySelect.value = String(state.quantity);
    }
    customTextInput.value = state.text;
    drawingColor.value = state.drawingColor;
    drawingSize.value = String(state.drawingSize);
    motifSizeInput.value = String(state.motifSize);
    designTextColor.value = state.textColor;
    designFont.value = state.font;
    designTextSize.value = String(state.textSize);
    designTextPosition.value = String(state.textPosition);
    designImageSizeInput.value = String(imageSize);
    designImageSizeValue.value = String(imageSize);
    designImageSizeValue.textContent = String(imageSize);
    removeDesignImageButton.disabled = !importedImage;
    imageStatus.textContent = importedImage
      ? 'Image restaurée. Utilise « Déplacer » pour la positionner.'
      : 'Choisis une image PNG, JPG ou WebP de 512 Ko maximum.';
    updateDesignerOutputs();
    updateRotationControls();
    updateShapeControls();
    updateRingControls();
    updateCustomPrice();
    renderKeychain();
  }

  function scheduleAutosave() {
    window.clearTimeout(autosaveTimer);
    autosaveTimer = window.setTimeout(() => {
      try {
        window.localStorage.setItem('skycraft-keychain-draft', createSnapshot());
      } catch {
        designerStatus.textContent = 'Impossible de sauvegarder automatiquement le brouillon : le stockage du navigateur est indisponible ou plein.';
      }
    }, 350);
  }

  function decodeImportedImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => {
        if (
          image.naturalWidth > 4096 ||
          image.naturalHeight > 4096 ||
          image.naturalWidth * image.naturalHeight > 16777216
        ) {
          reject(new Error('La résolution maximale est de 16 mégapixels.'));
          return;
        }
        resolve(image);
      }, { once: true });
      image.addEventListener('error', () => reject(new Error('Impossible de décoder cette image.')), { once: true });
      image.src = dataUrl;
    });
  }

  function updateShapeControls() {
    document.querySelectorAll('.shape-option[data-shape]').forEach((button) => {
      const selected = button.dataset.shape === bodyShape;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function updateRingControls() {
    document.querySelectorAll('.ring-option[data-ring-color]').forEach((button) => {
      const selected = button.dataset.ringColor === ringColor;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function updateDesignerOutputs() {
    drawingSizeValue.value = drawingSize.value;
    drawingSizeValue.textContent = drawingSize.value;
    motifSizeValue.value = motifSizeInput.value;
    motifSizeValue.textContent = motifSizeInput.value;
    designImageSizeValue.value = String(imageSize);
    designImageSizeValue.textContent = String(imageSize);
    designTextSizeValue.value = designTextSize.value;
    designTextSizeValue.textContent = designTextSize.value;
    designTextPositionValue.value = designTextPosition.value;
    designTextPositionValue.textContent = designTextPosition.value;
    document.querySelectorAll('.palette-swatch').forEach((swatch) => {
      const selected = swatch.dataset.color === drawingColor.value;
      swatch.classList.toggle('is-selected', selected);
      swatch.setAttribute('aria-pressed', String(selected));
    });
  }

  function drawKeychainBodyPath(ctx) {
    ctx.beginPath();
    if (bodyShape === 'heart') {
      ctx.moveTo(0, 88);
      ctx.bezierCurveTo(0, 72, -83, 27, -83, -20);
      ctx.bezierCurveTo(-83, -67, -27, -78, 0, -36);
      ctx.bezierCurveTo(27, -78, 83, -67, 83, -20);
      ctx.bezierCurveTo(83, 27, 0, 72, 0, 88);
    } else if (bodyShape === 'star') {
      for (let point = 0; point < 10; point += 1) {
        const radius = point % 2 === 0 ? 88 : 42;
        const angle = -Math.PI / 2 + (point * Math.PI) / 5;
        const x = Math.cos(angle) * radius;
        const y = bodyBounds.centerY + Math.sin(angle) * radius;
        if (point === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    } else if (bodyShape === 'hexagon') {
      for (let point = 0; point < 6; point += 1) {
        const angle = -Math.PI / 2 + (point * Math.PI) / 3;
        const x = Math.cos(angle) * 84;
        const y = bodyBounds.centerY + Math.sin(angle) * 84;
        if (point === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    } else {
      ctx.arc(bodyBounds.centerX, bodyBounds.centerY, bodyBounds.radius, 0, Math.PI * 2);
    }
    ctx.closePath();
  }

  function drawMotif(ctx, motif, x, y, color, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 24, size / 24);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    if (motif === 'star') {
      ctx.beginPath();
      for (let point = 0; point < 10; point += 1) {
        const radius = point % 2 === 0 ? 13 : 6;
        const pointAngle = -Math.PI / 2 + (point * Math.PI) / 5;
        const pointX = Math.cos(pointAngle) * radius;
        const pointY = Math.sin(pointAngle) * radius;
        if (point === 0) ctx.moveTo(pointX, pointY);
        else ctx.lineTo(pointX, pointY);
      }
      ctx.closePath();
      ctx.fill();
    } else if (motif === 'heart') {
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.bezierCurveTo(-20, 0, -12, -14, 0, -5);
      ctx.bezierCurveTo(12, -14, 20, 0, 0, 12);
      ctx.fill();
    } else if (motif === 'flower') {
      for (let petal = 0; petal < 6; petal += 1) {
        const petalAngle = (petal * Math.PI) / 3;
        ctx.beginPath();
        ctx.arc(Math.cos(petalAngle) * 7, Math.sin(petalAngle) * 7, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#f2c94c';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (motif === 'diamond') {
      ctx.beginPath();
      ctx.moveTo(0, -13);
      ctx.lineTo(11, 0);
      ctx.lineTo(0, 13);
      ctx.lineTo(-11, 0);
      ctx.closePath();
      ctx.fill();
    } else if (motif === 'smile') {
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-4, -3, 1.5, 0, Math.PI * 2);
      ctx.arc(4, -3, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -1, 7, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawDesignElement(ctx, element) {
    if (element.type === 'stroke') {
      if (!element.points.length) return;
      ctx.strokeStyle = element.color;
      ctx.lineWidth = element.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(element.points[0].x, element.points[0].y);
      element.points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
      if (element.points.length === 1) {
        ctx.lineTo(element.points[0].x + 0.1, element.points[0].y + 0.1);
      }
      ctx.stroke();
      return;
    }

    drawMotif(ctx, element.type, element.x, element.y, element.color, element.size);
  }

  function renderKeychain() {
    context.clearRect(0, 0, keychainCanvas.width, keychainCanvas.height);
    context.save();
    context.translate(canvasCenter.x, canvasCenter.y);
    const radiansX = (rotationX * Math.PI) / 180;
    const radiansY = (rotationY * Math.PI) / 180;
    const cosX = Math.cos(radiansX);
    const sinX = Math.sin(radiansX);
    const cosY = Math.cos(radiansY);
    const sinY = Math.sin(radiansY);
    context.transform(cosY, 0, sinY * sinX, cosX, 0, 0);

    context.strokeStyle = ringColors[ringColor];
    context.lineWidth = 12;
    context.beginPath();
    context.arc(0, -125, 43, 0, Math.PI * 2);
    context.stroke();

    context.strokeStyle = ringColors[ringColor];
    context.lineWidth = 12;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(0, -81);
    context.lineTo(0, -54);
    context.stroke();

    context.save();
    drawKeychainBodyPath(context);
    context.shadowColor = 'rgba(27, 47, 37, 0.2)';
    context.shadowBlur = 18;
    context.shadowOffsetY = 8;
    context.fillStyle =
      Math.cos(radiansX) * Math.cos(radiansY) < 0
        ? '#52645a'
        : bodyCustomColor || keychainColors[customColorSelect.value] || keychainColors.vert;
    context.fill();
    context.restore();

    context.save();
    drawKeychainBodyPath(context);
    context.clip();
    design.forEach((element) => drawDesignElement(context, element));
    if (importedImage) {
      const largestDimension = Math.max(importedImage.naturalWidth, importedImage.naturalHeight);
      const scale = imageSize / largestDimension;
      const imageWidth = importedImage.naturalWidth * scale;
      const imageHeight = importedImage.naturalHeight * scale;
      context.drawImage(
        importedImage,
        imageX - imageWidth / 2,
        imageY - imageHeight / 2,
        imageWidth,
        imageHeight
      );
    }
    const text = customTextInput.value.trim().toLocaleUpperCase('fr-FR') || 'TON TEXTE';
    context.fillStyle = designTextColor.value;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `800 ${Number(designTextSize.value)}px "${designFont.value}", sans-serif`;
    const measuredWidth = context.measureText(text).width;
    const textScale = measuredWidth > 252 ? 252 / measuredWidth : 1;
    context.translate(textX, Number(designTextPosition.value) + textY);
    context.scale(textScale, 1);
    context.fillText(text, 0, 0, 252);
    context.restore();

    context.restore();
    updateDesignSummary();
    scheduleAutosave();
  }

  function isInsideKeychain(point) {
    context.beginPath();
    drawKeychainBodyPath(context);
    return context.isPointInPath(point.x, point.y);
  }

  function pointerToKeychain(event) {
    const bounds = keychainCanvas.getBoundingClientRect();
    const canvasX = ((event.clientX - bounds.left) / bounds.width) * keychainCanvas.width;
    const canvasY = ((event.clientY - bounds.top) / bounds.height) * keychainCanvas.height;
    const deltaX = canvasX - canvasCenter.x;
    const deltaY = canvasY - canvasCenter.y;
    const radiansX = (rotationX * Math.PI) / 180;
    const radiansY = (rotationY * Math.PI) / 180;
    const a = Math.cos(radiansY);
    const c = Math.sin(radiansY) * Math.sin(radiansX);
    const d = Math.cos(radiansX);
    const determinant = a * d;
    if (Math.abs(determinant) < 0.08) return null;
    return {
      x: (d * deltaX - c * deltaY) / determinant,
      y: (a * deltaY) / determinant,
    };
  }

  function getDesignTarget(point) {
    if (importedImage) {
      const largestDimension = Math.max(importedImage.naturalWidth, importedImage.naturalHeight);
      const scale = imageSize / largestDimension;
      const imageWidth = importedImage.naturalWidth * scale;
      const imageHeight = importedImage.naturalHeight * scale;
      if (
        Math.abs(point.x - imageX) <= imageWidth / 2 + 8 &&
        Math.abs(point.y - imageY) <= imageHeight / 2 + 8
      ) return { type: 'image' };
    }

    const text = customTextInput.value.trim();
    if (text) {
      context.save();
      context.font = `800 ${Number(designTextSize.value)}px "${designFont.value}", sans-serif`;
      const textWidth = Math.min(context.measureText(text.toLocaleUpperCase('fr-FR')).width, 252);
      context.restore();
      const textCenterY = Number(designTextPosition.value) + textY;
      if (
        Math.abs(point.x - textX) <= textWidth / 2 + 8 &&
        Math.abs(point.y - textCenterY) <= Number(designTextSize.value) * 0.8
      ) return { type: 'text' };
    }

    for (let index = design.length - 1; index >= 0; index -= 1) {
      const element = design[index];
      if (element.type === 'stroke') continue;
      const distanceX = point.x - element.x;
      const distanceY = point.y - element.y;
      if (Math.hypot(distanceX, distanceY) <= Math.max(element.size * 0.7, 12)) {
        return { type: 'motif', index };
      }
    }
    return null;
  }

  function normalizeRotation(value) {
    return ((value % 360) + 360) % 360;
  }

  function updateRotationControls() {
    rotationInput.value = String(rotationY);
    rotationValue.value = `${rotationY}°`;
    rotationValue.textContent = `${rotationY}°`;
    tiltInput.value = String(rotationX);
    tiltValue.value = `${rotationX}°`;
    tiltValue.textContent = `${rotationX}°`;
  }

  function updateCustomPrice() {
    const quantity = Number(customQuantitySelect.value);
    const price = getBundlePrice('Porte-clés', quantity);
    customPriceNote.textContent = price === null
      ? 'Le prix sera confirmé par e-mail.'
      : `Prix indicatif : ${euroFormatter.format(price / 100)}. Le prix final de la personnalisation sera confirmé par e-mail.`;
    updateDesignSummary();
  }

  function updateDesignSummary() {
    if (!designSummary) return;
    const price = getBundlePrice('Porte-clés', Number(customQuantitySelect.value));
    const colorName = bodyCustomColor
      ? `Personnalisée (${bodyCustomColor.toUpperCase()})`
      : keychainColorNames[customColorSelect.value];
    const shapeNames = { round: 'Rond', heart: 'Cœur', star: 'Étoile', hexagon: 'Hexagone' };
    const shapeName = shapeNames[bodyShape];
    const ringName = ringColor === 'silver' ? 'Argent' : ringColor === 'gold' ? 'Doré' : 'Or rose';
    const motifCount = design.filter((element) => element.type !== 'stroke').length;
    const strokeCount = design.filter((element) => element.type === 'stroke').length;
    designSummary.textContent =
      `Forme : ${shapeName} · Couleur : ${colorName} · Anneau : ${ringName}\n` +
      `Texte : ${customTextInput.value.trim() || 'aucun'} · Motifs : ${motifCount} · Dessins : ${strokeCount} · Image : ${importedImage ? 'oui' : 'non'}\n` +
      `Quantité : ${customQuantitySelect.value} · Prix indicatif : ${price === null ? 'à confirmer' : euroFormatter.format(price / 100)} (hors personnalisation)`;
  }

  function setActiveTool(tool) {
    activeTool = tool;
    document.querySelectorAll('.tool-button[data-tool]').forEach((button) => {
      const isActive = button.dataset.tool === tool;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    toolHelp.textContent =
      tool === 'move'
        ? 'Fais glisser le texte ou un motif sur le porte-clés pour le déplacer.'
        : tool === 'rotate'
        ? 'Fais glisser sur le porte-clés : gauche/droite et haut/bas pour le tourner à 360°.'
        : tool === 'draw'
          ? 'Fais glisser ton doigt ou ta souris sur le porte-clés pour dessiner.'
          : 'Clique ou touche le porte-clés pour placer le motif choisi.';
    keychainCanvas.style.cursor = tool === 'rotate' ? 'grab' : tool === 'draw' ? 'crosshair' : tool === 'move' ? 'move' : 'copy';
  }

  function isValidColor(value) {
    return typeof value === 'string' && /^#[\da-f]{6}$/i.test(value);
  }

  function isValidProjectState(state) {
    const bodyColors = Object.keys(keychainColors);
    const fonts = ['Manrope', 'DM Sans', 'Georgia'];
    const validNumber = (value, min, max) => Number.isFinite(value) && value >= min && value <= max;
    if (!state || !Array.isArray(state.design) || state.design.length > 300) return false;
    if (!validNumber(state.rotationY, 0, 360) || !validNumber(state.rotationX, 0, 360)) return false;
    if (state.bodyShape !== undefined && !['round', 'heart', 'star', 'hexagon'].includes(state.bodyShape)) return false;
    if (state.ringColor !== undefined && !Object.prototype.hasOwnProperty.call(ringColors, state.ringColor)) return false;
    if (
      !(bodyColors.includes(state.bodyColor) || state.bodyColor === 'custom') ||
      typeof state.text !== 'string' ||
      state.text.length > 12
    ) return false;
    if (state.bodyColor === 'custom' && !isValidColor(state.bodyCustomColor)) return false;
    if (state.bodyCustomColor !== undefined && state.bodyCustomColor !== null && !isValidColor(state.bodyCustomColor)) return false;
    if (state.quantity !== undefined && (!Number.isInteger(state.quantity) || !validNumber(state.quantity, 1, 15))) return false;
    if (state.textX !== undefined && !validNumber(state.textX, -100, 100)) return false;
    if (state.textY !== undefined && !validNumber(state.textY, -100, 100)) return false;
    if (
      state.importedImageData !== undefined &&
      state.importedImageData !== null &&
      (
        typeof state.importedImageData !== 'string' ||
        state.importedImageData.length > 700000 ||
        !/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(state.importedImageData)
      )
    ) return false;
    if (state.imageX !== undefined && !validNumber(state.imageX, -100, 100)) return false;
    if (state.imageY !== undefined && !validNumber(state.imageY, -100, 100)) return false;
    if (state.imageSize !== undefined && (!Number.isInteger(state.imageSize) || !validNumber(state.imageSize, 36, 140))) return false;
    if (!isValidColor(state.drawingColor) || !isValidColor(state.textColor)) return false;
    if (!Number.isInteger(state.drawingSize) || !validNumber(state.drawingSize, 2, 18)) return false;
    if (!Number.isInteger(state.motifSize) || !validNumber(state.motifSize, 12, 40)) return false;
    if (!fonts.includes(state.font) || !Number.isInteger(state.textSize) || !validNumber(state.textSize, 12, 34)) return false;
    if (!Number.isInteger(state.textPosition) || !validNumber(state.textPosition, -30, 45)) return false;

    return state.design.every((element) => {
      if (!element || !isValidColor(element.color)) return false;
      if (element.type === 'stroke') {
        return Number.isInteger(element.width)
          && validNumber(element.width, 2, 18)
          && Array.isArray(element.points)
          && element.points.length > 0
          && element.points.length <= 20000
          && element.points.every((point) =>
            point && validNumber(point.x, -100, 100) && validNumber(point.y, -100, 100)
          );
      }

      return ['star', 'heart', 'flower', 'circle', 'diamond', 'smile'].includes(element.type)
        && validNumber(element.x, -100, 100)
        && validNumber(element.y, -100, 100)
        && validNumber(element.size, 12, 40);
    });
  }

  function downloadFile(filename, contents, type) {
    const url = URL.createObjectURL(new Blob([contents], { type }));
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = url;
    downloadLink.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  customTextInput.addEventListener('input', renderKeychain);
  customTextInput.addEventListener('change', recordHistory);
  customColorSelect.addEventListener('change', () => {
    if (customColorSelect.value === 'custom') {
      bodyCustomColor = customColorPicker.value;
    } else {
      bodyCustomColor = null;
      customColorPicker.value = keychainColors[customColorSelect.value];
    }
    renderKeychain();
    recordHistory();
  });
  customColorPicker.addEventListener('input', () => {
    bodyCustomColor = customColorPicker.value;
    customColorSelect.value = 'custom';
    renderKeychain();
  });
  customColorPicker.addEventListener('change', recordHistory);
  designImageFile.addEventListener('change', () => {
    const file = designImageFile.files[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      imageStatus.textContent = 'Format non pris en charge. Choisis une image PNG, JPG ou WebP.';
      designImageFile.value = '';
      return;
    }
    if (file.size > 512 * 1024) {
      imageStatus.textContent = 'Cette image dépasse 512 Ko. Choisis un fichier plus léger.';
      designImageFile.value = '';
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', async () => {
      try {
        const dataUrl = String(reader.result);
        const image = await decodeImportedImage(dataUrl);
        importedImageData = dataUrl;
        importedImage = image;
        imageX = 0;
        imageY = 0;
        removeDesignImageButton.disabled = false;
        renderKeychain();
        recordHistory();
        imageStatus.textContent = 'Image ajoutée. Utilise « Déplacer » pour la positionner sur le porte-clés.';
      } catch (error) {
        imageStatus.textContent = error instanceof Error && error.message === 'La résolution maximale est de 16 mégapixels.'
          ? 'Cette image a une résolution trop élevée. Choisis une image de moins de 16 mégapixels.'
          : 'Cette image n’a pas pu être ouverte. Essaie un autre fichier PNG, JPG ou WebP.';
      } finally {
        designImageFile.value = '';
      }
    });
    reader.addEventListener('error', () => {
      imageStatus.textContent = 'Erreur pendant la lecture de l’image. Réessaie avec un autre fichier.';
      designImageFile.value = '';
    });
    reader.readAsDataURL(file);
  });
  designImageSizeInput.addEventListener('input', () => {
    imageSize = Number(designImageSizeInput.value);
    designImageSizeValue.value = designImageSizeInput.value;
    designImageSizeValue.textContent = designImageSizeInput.value;
    renderKeychain();
  });
  designImageSizeInput.addEventListener('change', recordHistory);
  removeDesignImageButton.addEventListener('click', () => {
    if (!importedImage) return;
    importedImage = null;
    importedImageData = null;
    imageX = 0;
    imageY = 0;
    removeDesignImageButton.disabled = true;
    renderKeychain();
    recordHistory();
    imageStatus.textContent = 'Image retirée de ton porte-clés.';
  });
  document.querySelectorAll('.shape-option[data-shape]').forEach((button) => {
    button.addEventListener('click', () => {
      bodyShape = button.dataset.shape;
      updateShapeControls();
      renderKeychain();
      recordHistory();
    });
  });
  document.querySelectorAll('.ring-option[data-ring-color]').forEach((button) => {
    button.addEventListener('click', () => {
      ringColor = button.dataset.ringColor;
      updateRingControls();
      renderKeychain();
      recordHistory();
    });
  });
  customQuantitySelect.addEventListener('change', () => {
    updateCustomPrice();
    recordHistory();
  });
  updateCustomPrice();
  rotationInput.addEventListener('input', () => {
    rotationY = Number(rotationInput.value);
    updateRotationControls();
    renderKeychain();
  });
  rotationInput.addEventListener('change', recordHistory);
  tiltInput.addEventListener('input', () => {
    rotationX = Number(tiltInput.value);
    updateRotationControls();
    renderKeychain();
  });
  tiltInput.addEventListener('change', recordHistory);
  [drawingSize, motifSizeInput, designTextSize, designTextPosition].forEach((input) => {
    input.addEventListener('input', () => {
      updateDesignerOutputs();
      renderKeychain();
    });
    input.addEventListener('change', recordHistory);
  });
  drawingColor.addEventListener('input', () => {
    updateDesignerOutputs();
    renderKeychain();
  });
  [designTextColor, designFont].forEach((input) => {
    input.addEventListener('input', renderKeychain);
  });
  [drawingColor, designTextColor, designFont].forEach((input) => {
    input.addEventListener('change', recordHistory);
  });
  document.querySelectorAll('.palette-swatch[data-color]').forEach((button) => {
    button.addEventListener('click', () => {
      drawingColor.value = button.dataset.color;
      document.querySelectorAll('.palette-swatch').forEach((swatch) => {
        const selected = swatch === button;
        swatch.classList.toggle('is-selected', selected);
        swatch.setAttribute('aria-pressed', String(selected));
      });
      recordHistory();
    });
  });
  document.querySelectorAll('[data-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const color = drawingColor.value;
      const size = Number(motifSizeInput.value);
      if (button.dataset.preset === 'stars') {
        design.push(
          { type: 'star', x: -34, y: -18, color, size },
          { type: 'star', x: 34, y: -18, color, size },
          { type: 'star', x: 0, y: 40, color, size }
        );
      } else {
        design.push({ type: button.dataset.preset, x: 0, y: 12, color, size });
      }
      renderKeychain();
      recordHistory();
      designerStatus.textContent = 'Motif ajouté ! Tu peux le compléter ou annuler.';
    });
  });

  document.querySelectorAll('.tool-button[data-tool]').forEach((button) => {
    button.addEventListener('click', () => setActiveTool(button.dataset.tool));
  });

  keychainCanvas.addEventListener('pointerdown', (event) => {
    if (activeTool === 'rotate') {
      activeRotation = { x: event.clientX, y: event.clientY };
      keychainCanvas.setPointerCapture(event.pointerId);
      keychainCanvas.style.cursor = 'grabbing';
      event.preventDefault();
      return;
    }

    const point = pointerToKeychain(event);
    if (!point || !isInsideKeychain(point)) return;
    event.preventDefault();

    if (activeTool === 'move') {
      const target = getDesignTarget(point);
      if (!target) {
        designerStatus.textContent = 'Choisis le texte ou un motif pour le déplacer.';
        return;
      }
      activeMove = {
        ...target,
        startX: point.x,
        startY: point.y,
        originalX: target.type === 'text' ? textX : target.type === 'image' ? imageX : design[target.index].x,
        originalY: target.type === 'text' ? textY : target.type === 'image' ? imageY : design[target.index].y,
      };
      keychainCanvas.setPointerCapture(event.pointerId);
      return;
    }

    if (activeTool !== 'draw') {
      design.push({
        type: activeTool,
        x: point.x,
        y: point.y,
        color: drawingColor.value,
        size: Number(motifSizeInput.value),
      });
      renderKeychain();
      recordHistory();
      return;
    }

    activeStroke = {
      type: 'stroke',
      points: [point],
      color: drawingColor.value,
      width: Number(drawingSize.value),
    };
    design.push(activeStroke);
    keychainCanvas.setPointerCapture(event.pointerId);
    renderKeychain();
  });

  keychainCanvas.addEventListener('pointermove', (event) => {
    if (activeRotation) {
      const deltaX = event.clientX - activeRotation.x;
      const deltaY = event.clientY - activeRotation.y;
      activeRotation = { x: event.clientX, y: event.clientY };
      rotationY = normalizeRotation(rotationY + deltaX);
      rotationX = normalizeRotation(rotationX + deltaY);
      updateRotationControls();
      renderKeychain();
      return;
    }

    if (activeMove) {
      const point = pointerToKeychain(event);
      if (!point || !isInsideKeychain(point)) return;
      const movedX = activeMove.originalX + point.x - activeMove.startX;
      const movedY = activeMove.originalY + point.y - activeMove.startY;
      if (activeMove.type === 'text') {
        textX = Math.max(-100, Math.min(100, movedX));
        textY = Math.max(-100, Math.min(100, movedY));
      } else if (activeMove.type === 'image') {
        imageX = Math.max(-100, Math.min(100, movedX));
        imageY = Math.max(-100, Math.min(100, movedY));
      } else {
        design[activeMove.index].x = Math.max(-100, Math.min(100, movedX));
        design[activeMove.index].y = Math.max(-100, Math.min(100, movedY));
      }
      renderKeychain();
      return;
    }

    if (!activeStroke) return;
    const point = pointerToKeychain(event);
    if (point && isInsideKeychain(point)) activeStroke.points.push(point);
    renderKeychain();
  });

  function finishDrawing() {
    const hadDrawing = Boolean(activeStroke);
    const hadRotation = Boolean(activeRotation);
    const hadMove = Boolean(activeMove);
    activeStroke = null;
    activeRotation = null;
    activeMove = null;
    if (activeTool === 'rotate') keychainCanvas.style.cursor = 'grab';
    if (hadDrawing || hadRotation || hadMove) recordHistory();
  }

  keychainCanvas.addEventListener('pointerup', finishDrawing);
  keychainCanvas.addEventListener('pointercancel', finishDrawing);

  document.querySelector('#undo-design').addEventListener('click', async () => {
    if (historyIndex <= 0) return;
    historyIndex -= 1;
    try {
      await restoreSnapshot(history[historyIndex]);
      updateHistoryButtons();
      designerStatus.textContent = 'Action annulée.';
    } catch {
      historyIndex += 1;
      designerStatus.textContent = 'Impossible de restaurer cette version de la création.';
    }
  });

  document.querySelector('#redo-design').addEventListener('click', async () => {
    if (historyIndex >= history.length - 1) return;
    historyIndex += 1;
    try {
      await restoreSnapshot(history[historyIndex]);
      updateHistoryButtons();
      designerStatus.textContent = 'Action rétablie.';
    } catch {
      historyIndex -= 1;
      designerStatus.textContent = 'Impossible de rétablir cette version de la création.';
    }
  });

  document.querySelector('#clear-design').addEventListener('click', () => {
    if (design.length === 0) return;
    design.length = 0;
    renderKeychain();
    recordHistory();
    designerStatus.textContent = 'Les motifs ont été effacés. Ton texte est conservé.';
  });

  document.querySelector('#reset-design').addEventListener('click', () => {
    design.length = 0;
    rotationY = 0;
    rotationX = 0;
    bodyShape = 'round';
    ringColor = 'silver';
    bodyCustomColor = null;
    textX = 0;
    textY = 0;
    importedImageData = null;
    importedImage = null;
    imageX = 0;
    imageY = 0;
    imageSize = 84;
    designImageSizeInput.value = '84';
    designImageSizeValue.value = '84';
    designImageSizeValue.textContent = '84';
    removeDesignImageButton.disabled = true;
    imageStatus.textContent = 'Choisis une image PNG, JPG ou WebP de 512 Ko maximum.';
    customTextInput.value = '';
    customColorSelect.value = 'vert';
    customColorPicker.value = keychainColors.vert;
    drawingColor.value = '#17241f';
    drawingSize.value = '6';
    motifSizeInput.value = '24';
    designTextColor.value = '#ffffff';
    designFont.value = 'Manrope';
    designTextSize.value = '22';
    designTextPosition.value = '17';
    updateDesignerOutputs();
    updateRotationControls();
    updateShapeControls();
    updateRingControls();
    renderKeychain();
    recordHistory();
    designerStatus.textContent = 'Le porte-clés a été réinitialisé.';
  });

  document.querySelector('#download-design').addEventListener('click', () => {
    renderKeychain();
    const downloadLink = document.createElement('a');
    downloadLink.download = 'mon-porte-cles-skycraft.png';
    downloadLink.href = keychainCanvas.toDataURL('image/png');
    downloadLink.click();
    designerStatus.textContent = 'Aperçu PNG téléchargé. Tu peux le joindre à ta demande par e-mail.';
  });

  document.querySelector('#save-project').addEventListener('click', () => {
    const project = { format: 'skycraft-keychain', version: 3, state: JSON.parse(createSnapshot()) };
    const contents = JSON.stringify(project, null, 2);
    if (new Blob([contents]).size > 2 * 1024 * 1024) {
      designerStatus.textContent = 'Ce projet dépasse 2 Mo et ne peut pas être enregistré. Retire quelques dessins ou choisis une image plus légère.';
      return;
    }
    downloadFile('mon-projet-skycraft.json', contents, 'application/json');
    designerStatus.textContent = 'Projet enregistré. Garde le fichier JSON pour reprendre ta création plus tard.';
  });

  const projectInput = document.querySelector('#load-project');
  document.querySelector('#load-project-button').addEventListener('click', () => projectInput.click());
  projectInput.addEventListener('change', () => {
    const file = projectInput.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      designerStatus.textContent = 'Ce fichier dépasse 2 Mo. Choisis un fichier de projet SKYCRAFT valide.';
      projectInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', async () => {
      try {
        const project = JSON.parse(String(reader.result));
        if (
          project.format !== 'skycraft-keychain' ||
          ![1, 2, 3].includes(project.version) ||
          !isValidProjectState(project.state)
        ) {
          designerStatus.textContent = 'Fichier non reconnu ou invalide. Ta création actuelle est conservée.';
          return;
        }
        await restoreSnapshot(JSON.stringify(project.state));
        recordHistory();
        designerStatus.textContent = 'Projet ouvert avec succès.';
      } catch {
        designerStatus.textContent = 'Impossible de lire ce fichier JSON. Ta création actuelle est conservée.';
      } finally {
        projectInput.value = '';
      }
    });
    reader.addEventListener('error', () => {
      designerStatus.textContent = 'Erreur de lecture du fichier. Réessaie avec un projet SKYCRAFT enregistré.';
      projectInput.value = '';
    });
    reader.readAsText(file);
  });

  updateDesignerOutputs();
  updateShapeControls();
  updateRingControls();
  setActiveTool('draw');
  async function restoreAutosavedDraft() {
    let savedDraft;
    try {
      savedDraft = window.localStorage.getItem('skycraft-keychain-draft');
    } catch {
      designerStatus.textContent = 'La sauvegarde automatique est indisponible sur ce navigateur.';
      renderKeychain();
      recordHistory();
      return;
    }

    if (!savedDraft) {
      renderKeychain();
      recordHistory();
      return;
    }

    try {
      const state = JSON.parse(savedDraft);
      if (!isValidProjectState(state)) {
        designerStatus.textContent = 'Le brouillon automatique est invalide. Tu peux commencer une nouvelle création.';
        renderKeychain();
        recordHistory();
        return;
      }
      await restoreSnapshot(savedDraft);
      designerStatus.textContent = 'Ton dernier brouillon a été restauré automatiquement.';
    } catch {
      designerStatus.textContent = 'Impossible de restaurer le brouillon automatique. Commence une nouvelle création ou ouvre un projet enregistré.';
      renderKeychain();
    }
    recordHistory();
  }

  restoreAutosavedDraft();

  document.addEventListener('keydown', (event) => {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
    ) return;

    if (event.key.toLowerCase() === 'z' && !event.shiftKey) {
      event.preventDefault();
      document.querySelector('#undo-design').click();
    } else if (event.key.toLowerCase() === 'y' || (event.key.toLowerCase() === 'z' && event.shiftKey)) {
      event.preventDefault();
      document.querySelector('#redo-design').click();
    }
  });

  customizeForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!customizeForm.reportValidity()) return;

    const formData = new FormData(customizeForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const customText = String(formData.get('customText') || '').trim() || 'Aucun texte';
    const color = bodyCustomColor
      ? `Personnalisée (${bodyCustomColor.toUpperCase()})`
      : keychainColorNames[String(formData.get('color') || '').trim()];
    const quantity = Number(formData.get('quantity'));
    const price = getBundlePrice('Porte-clés', quantity);
    if (price === null) return;
    const additionalMessage = String(formData.get('message') || '').trim();
    const imageDescription = importedImage
      ? `Image importée : oui (taille ${imageSize}, position x=${Math.round(imageX)}, y=${Math.round(imageY)})`
      : 'Image importée : non';
    const message = [additionalMessage, imageDescription].filter(Boolean).join('\n') || 'Aucune précision';
    const shapeLabel = { round: 'Rond', heart: 'Cœur', star: 'Étoile', hexagon: 'Hexagone' }[bodyShape];
    const motifCount = design.filter((element) => element.type !== 'stroke').length;
    const strokeCount = design.filter((element) => element.type === 'stroke').length;
    renderKeychain();
    const previewLink = document.createElement('a');
    previewLink.download = 'mon-porte-cles-skycraft.png';
    previewLink.href = keychainCanvas.toDataURL('image/png');
    previewLink.click();
    const subject = encodeURIComponent('Demande de personnalisation de porte-clés SKYCRAFT');
    const body = encodeURIComponent(
      `Bonjour SKYCRAFT,\n\nJe souhaite commander le modèle personnalisé suivant.\n\nNom : ${name}\nE-mail : ${email}\nNombre de porte-clés : ${quantity}\nPrix indicatif hors personnalisation : ${euroFormatter.format(price / 100)}\nTexte souhaité : ${customText}\nCouleur du porte-clés : ${color}\nForme : ${shapeLabel}\nFinition de l’anneau : ${ringColor === 'silver' ? 'Argent' : ringColor === 'gold' ? 'Doré' : 'Or rose'}\nStyle du texte : ${designFont.value}, ${designTextSize.value}px, couleur ${designTextColor.value}\nPosition du texte : x=${Math.round(textX)}, y=${Math.round(Number(designTextPosition.value) + textY)}\nMotifs ajoutés : ${motifCount}\nTraits dessinés : ${strokeCount}\nRotation gauche/droite : ${rotationY}°\nInclinaison haut/bas : ${rotationX}°\n\nAutres détails :\n${message}\n\nJ’ai joint l’aperçu PNG de ma création. Merci de confirmer la disponibilité et le prix final.`
    );

    customizeNote.textContent = 'Ton aperçu PNG a été téléchargé. Joins le fichier mon-porte-cles-skycraft.png à l’e-mail qui s’ouvre, puis envoie-le pour transmettre ta commande.';
    window.location.href = `mailto:clem.diet57@gmail.com?subject=${subject}&body=${body}`;
  });
}
