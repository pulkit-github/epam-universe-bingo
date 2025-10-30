import type { Persona, Score } from '../types';

export function generateShareableImage(persona: Persona, score: Score): string {
  // This function could generate a shareable image using Canvas API
  // For now, we'll return a data URL placeholder
  // In a production app, you might want to use a library like html2canvas or create a server-side image generation
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // Set canvas size
  canvas.width = 800;
  canvas.height = 600;
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('EPAM Universe Bingo', canvas.width / 2, 80);
  
  // Add persona title
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 36px Arial';
  ctx.fillText(persona.title, canvas.width / 2, 150);
  
  // Add score
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px Arial';
  ctx.fillText(`Score: ${score.total}/85`, canvas.width / 2, 200);
  
  // Add description
  ctx.fillStyle = '#cccccc';
  ctx.font = '20px Arial';
  const words = persona.desc.split(' ');
  let line = '';
  let y = 250;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > canvas.width - 100 && i > 0) {
      ctx.fillText(line, canvas.width / 2, y);
      line = words[i] + ' ';
      y += 30;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, canvas.width / 2, y);
  
  // Add cosmic elements
  ctx.fillStyle = '#ffd700';
  ctx.font = '24px Arial';
  ctx.fillText('🌟', 100, 100);
  ctx.fillText('🚀', canvas.width - 100, 100);
  ctx.fillText('✨', 100, canvas.height - 100);
  ctx.fillText('🌌', canvas.width - 100, canvas.height - 100);
  
  return canvas.toDataURL('image/png');
}

export function downloadShareableImage(persona: Persona, score: Score) {
  const imageDataUrl = generateShareableImage(persona, score);
  
  if (imageDataUrl) {
    const link = document.createElement('a');
    link.download = `epam-bingo-${persona.title.replace(/\s+/g, '-').toLowerCase()}-${score.total}.png`;
    link.href = imageDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
