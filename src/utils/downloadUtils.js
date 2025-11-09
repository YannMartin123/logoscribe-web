import jsPDF from 'jspdf';

/**
 * Télécharge le texte en fichier TXT
 */
export const downloadAsTxt = (text, filename = 'transcription') => {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Télécharge le texte en fichier PDF
 */
export const downloadAsPdf = (text, filename = 'transcription') => {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(text, 180);
  let y = 20;
  
  lines.forEach((line) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 15, y);
    y += 7;
  });
  
  doc.save(`${filename}.pdf`);
};

/**
 * Copie le texte dans le presse-papiers
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback pour les navigateurs plus anciens
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Partage le texte (Web Share API si disponible)
 */
export const shareText = async (text, title = 'Transcription') => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: text,
      });
      return true;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Erreur lors du partage:', err);
      }
      return false;
    }
  } else {
    // Fallback : copier dans le presse-papiers
    return await copyToClipboard(text);
  }
};

