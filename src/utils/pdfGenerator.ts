import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Transaction, Category } from '../types';
import { formatDH } from './currency';

export const generatePDF = async (transactions: Transaction[], categories: Category[]) => {
  if (transactions.length === 0) return;

  // On crée le HTML du tableau
  const rows = transactions.map(t => {
    const cat = categories.find(c => c.id === t.categoryId);
    const color = t.type === 'EXPENSE' ? '#E74C3C' : '#27AE60';
    const sign = t.type === 'EXPENSE' ? '-' : '+';
    
    return `
      <tr>
        <td>${new Date(t.date).toLocaleDateString('fr-FR')}</td>
        <td>${cat?.name || 'Autre'}</td>
        <td>${t.note || '-'}</td>
        <td style="color: ${color}; font-weight: bold; text-align: right;">
          ${sign} ${formatDH(t.amount)}
        </td>
      </tr>
    `;
  }).join('');

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { font-family: 'Helvetica', sans-serif; padding: 20px; }
          h1 { text-align: center; color: #006233; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f2f2f2; padding: 10px; text-align: left; }
          td { border-bottom: 1px solid #ddd; padding: 10px; }
          .footer { margin-top: 30px; text-align: center; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>Rapport Masroufi 🇲🇦</h1>
        <p>Date d'export : ${new Date().toLocaleDateString('fr-FR')}</p>
        
        <table>
          <tr>
            <th>Date</th>
            <th>Catégorie</th>
            <th>Note</th>
            <th style="text-align: right;">Montant</th>
          </tr>
          ${rows}
        </table>

        <div class="footer">
          Généré par l'application Masroufi
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  } catch (error) {
    console.error("Erreur PDF:", error);
  }
};