document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const imageUpload = document.getElementById('image-upload');
    const canvas = document.getElementById('qr-canvas');
    const downloadLink = document.getElementById('download-link');
    const colorDarkInput = document.getElementById('color-dark');
    const colorLightInput = document.getElementById('color-light');
    const qrTypeSelect = document.getElementById('qr-type');
    const wifiSsidInput = document.getElementById('wifi-ssid');
    const wifiPasswordInput = document.getElementById('wifi-password');
    const wifiEncryptionSelect = document.getElementById('wifi-encryption');
    const vcardNameInput = document.getElementById('vcard-name');
    const vcardPhoneInput = document.getElementById('vcard-phone');
    const vcardEmailInput = document.getElementById('vcard-email');
    const vcardCompanyInput = document.getElementById('vcard-company');
    const vcardTitleInput = document.getElementById('vcard-title');
    const vcardAddressInput = document.getElementById('vcard-address');

    const qrSize = 256;
    const context = canvas.getContext('2d');

    function generateQRCode() {
        let text = '';

        // Détermine le type de QR Code à générer
        if (qrTypeSelect.value === 'url') {
            text = textInput.value.trim();
        } else if (qrTypeSelect.value === 'wifi') {
            const ssid = wifiSsidInput.value.trim();
            const password = wifiPasswordInput.value.trim();
            const encryption = wifiEncryptionSelect.value;
            if (ssid) {
                text = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
            }
        } else if (qrTypeSelect.value === 'vcard') {
            const name = vcardNameInput.value.trim();
            const phone = vcardPhoneInput.value.trim();
            const email = vcardEmailInput.value.trim();
            const company = vcardCompanyInput.value.trim();
            const title = vcardTitleInput.value.trim();
            const address = vcardAddressInput.value.trim();

            if (name) {
                text = `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nTEL:${phone}\nEMAIL:${email}\nORG:${company}\nTITLE:${title}\nADR:${address}\nEND:VCARD`;
            }
        }

        if (!text) {
            context.clearRect(0, 0, qrSize, qrSize);
            downloadLink.innerHTML = '';
            return;
        }

        // Efface le canvas précédent
        canvas.width = qrSize;
        canvas.height = qrSize;
        context.clearRect(0, 0, qrSize, qrSize);

        // Génère le QR Code dans un div temporaire
        const tempDiv = document.createElement('div');
        new QRCode(tempDiv, {
            text: text,
            width: qrSize,
            height: qrSize,
            colorDark: colorDarkInput.value || "#000000",
            colorLight: colorLightInput.value || "#ffffff",
        });

        // Charge l'image générée par QRCode.js dans le canvas
        setTimeout(() => {
            const qrImage = tempDiv.querySelector('img');
            const img = new Image();
            img.src = qrImage.src;

            img.onload = () => {
                context.drawImage(img, 0, 0);

                // Ajoute une image si téléchargée
                if (imageUpload.files.length > 0) {
                    const file = imageUpload.files[0];
                    const reader = new FileReader();

                    reader.onload = () => {
                        const customImage = new Image();
                        customImage.onload = () => {
                            const size = qrSize / 3;
                            context.drawImage(customImage, qrSize / 2 - size / 2, qrSize / 2 - size / 2, size, size);
                            createDownloadLink();
                        };
                        customImage.src = reader.result;
                    };

                    reader.readAsDataURL(file);
                } else {
                    createDownloadLink();
                }
            };
        }, 100);
    }

    // Met à jour le QR Code en temps réel
    textInput.addEventListener('input', generateQRCode);
    colorDarkInput.addEventListener('input', generateQRCode);
    colorLightInput.addEventListener('input', generateQRCode);
    imageUpload.addEventListener('change', generateQRCode);
    qrTypeSelect.addEventListener('change', generateQRCode);
    wifiSsidInput.addEventListener('input', generateQRCode);
    wifiPasswordInput.addEventListener('input', generateQRCode);
    wifiEncryptionSelect.addEventListener('change', generateQRCode);
    vcardNameInput.addEventListener('input', generateQRCode);
    vcardPhoneInput.addEventListener('input', generateQRCode);
    vcardEmailInput.addEventListener('input', generateQRCode);
    vcardCompanyInput.addEventListener('input', generateQRCode);
    vcardTitleInput.addEventListener('input', generateQRCode);
    vcardAddressInput.addEventListener('input', generateQRCode);

    // Génère un lien de téléchargement pour le QR Code
    function createDownloadLink() {
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            downloadLink.innerHTML = `<a href="${url}" download="qrcode.png">Download QR Code</a>`;
        });
    }

    generateQRCode();
});
