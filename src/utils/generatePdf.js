import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const generateApartmentsPdf = async (apartmentsList) => {
    try {
        const rowsHTML = apartmentsList.map((item) => `
            <tr>
                <td>#${item.id}</td>
                <td>${item.floor}</td>
                <td>${item.number}</td>
                <td>${item.type}</td>
                <td>${item.description || '-'}</td>
                <td>
                    <span class="badge ${item.occupation_state === 'Ocupado' ? 'ocupado' : 'livre'}">
                        ${item.occupation_state || 'N/D'}
                    </span>
                </td>
            </tr>
        `).join('');

        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Relatório de Apartamentos</title>
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1E293B; margin: 0; padding: 20px; }
                        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284C7; padding-bottom: 10px; margin-bottom: 20px; }
                        h1 { color: #051937; font-size: 20px; margin: 0; }
                        .subtitle { font-size: 12px; color: #64748B; margin-top: 4px; }
                        .date { font-size: 12px; color: #64748B; text-align: right; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th { background-color: #0284C7; color: #FFFFFF; text-align: left; padding: 10px; font-size: 11px; text-transform: uppercase; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        td { padding: 10px; border-bottom: 1px solid #E2E8F0; font-size: 11px; color: #334155; }
                        tr:nth-child(even) { background-color: #F8FAFC; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .badge { padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 10px; display: inline-block; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .ocupado { background-color: #FFEDD5; color: #C2410C; }
                        .livre { background-color: #DCFCE7; color: #15803D; }
                        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 10px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div>
                            <h1>Relatório de Apartamentos</h1>
                            <div class="subtitle">Gestão de apartamentos do edifício</div>
                        </div>
                        <div class="date">Emitido em: ${new Date().toLocaleDateString('pt-PT')}</div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Andar</th>
                                <th>Número</th>
                                <th>Tipo</th>
                                <th>Descrição</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHTML}
                        </tbody>
                    </table>

                    <div class="footer">
                        Relatório gerado automaticamente pelo sistema de gestão. Total de registos: ${apartmentsList.length}
                    </div>
                </body>
            </html>
        `;

        // =========================================================
        // FLUXO PARA WEB
        // =========================================================
        if (Platform.OS === 'web') {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.open();
                printWindow.document.write(htmlContent);
                printWindow.document.close();
                printWindow.focus();
                // Pequeno atraso para garantir que os estilos carregam antes de abrir o diálogo de PDF
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 250);
            } else {
                alert('Por favor, permita pop-ups no navegador para gerar o PDF.');
            }
            return;
        }

        // =========================================================
        // FLUXO PARA MOBILE (iOS / Android)
        // =========================================================
        const { uri } = await Print.printToFileAsync({ html: htmlContent });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } else {
            alert('A partilha de PDF não está disponível neste dispositivo.');
        }

    } catch (error) {
        console.error('Erro ao gerar relatório PDF:', error);
        alert('Ocorreu um erro ao gerar o PDF.');
    }
};