import PDFDocument from 'pdfkit';
import { obtConsulta } from '../models/consultaModel.js';
import { obtMascota } from '../models/mascotaModel.js';
import { obtCliente } from '../models/clienteModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const generarReporteConsulta = async (req, res) => {
    try {
        const { consultaId } = req.params;

        // Obtener datos de la consulta
        const consulta = await obtConsulta(consultaId);
        if (!consulta) {
            return res.status(404).json({ error: 'Consulta no encontrada' });
        }

        // Obtener datos de la mascota
        const mascota = await obtMascota(consulta.mascota_id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        // Obtener datos del cliente
        const cliente = await obtCliente(mascota.cliente_id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        // Crear documento PDF
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50
        });

        // Headers para descargar el PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="reporte-consulta-${consultaId}.pdf"`);

        // Pipe del PDF a la respuesta
        doc.pipe(res);

        // Encabezado
        doc.fontSize(20).font('Helvetica-Bold').text('CLÍNICA VETERINARIA', { align: 'center' });
        doc.fontSize(12).font('Helvetica').text('Reporte de Consulta Médica', { align: 'center' });
        doc.moveDown();

        // Línea separadora
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown();

        // Información del Reporte
        doc.fontSize(11).font('Helvetica-Bold').text('INFORMACIÓN DEL REPORTE');
        doc.fontSize(10).font('Helvetica');
        doc.text(`ID Consulta: ${consulta.id}`);
        doc.text(`Fecha Consulta: ${new Date(consulta.fecha_consulta).toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`);
        doc.text(`Fecha Reporte: ${new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        })}`);
        doc.moveDown();

        // Información del Cliente
        doc.fontSize(11).font('Helvetica-Bold').text('INFORMACIÓN DEL CLIENTE');
        doc.fontSize(10).font('Helvetica');
        doc.text(`Nombre: ${cliente.nombre} ${cliente.apellido}`);
        doc.text(`Email: ${cliente.email || 'N/A'}`);
        doc.text(`Teléfono: ${cliente.telefono || 'N/A'}`);
        doc.text(`Dirección: ${cliente.direccion || 'N/A'}`);
        doc.moveDown();

        // Información de la Mascota
        doc.fontSize(11).font('Helvetica-Bold').text('INFORMACIÓN DE LA MASCOTA');
        doc.fontSize(10).font('Helvetica');
        doc.text(`Nombre: ${mascota.nombre}`);
        doc.text(`Especie: ${mascota.especie || 'N/A'}`);
        doc.text(`Raza: ${mascota.raza || 'N/A'}`);
        doc.text(`Fecha de Nacimiento: ${mascota.fecha_nacimiento ? new Date(mascota.fecha_nacimiento).toLocaleDateString('es-ES') : 'N/A'}`);
        doc.moveDown();

        // Detalles Médicos
        doc.fontSize(11).font('Helvetica-Bold').text('DETALLES MÉDICOS');
        doc.fontSize(10).font('Helvetica');
        
        doc.text('Motivo de la Consulta:', { underline: true });
        doc.text(consulta.motivo || 'No especificado');
        doc.moveDown(0.5);

        doc.text('Diagnóstico:', { underline: true });
        doc.text(consulta.diagnostico || 'No especificado');
        doc.moveDown(0.5);

        doc.text('Tratamiento:', { underline: true });
        doc.text(consulta.tratamiento || 'No especificado');
        doc.moveDown();

        // Pie de página
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica-Oblique').text(
            `Este documento fue generado automáticamente el ${new Date().toLocaleString('es-ES')}`,
            { align: 'center' }
        );

        // Finalizar PDF
        doc.end();
    } catch (error) {
        console.error('Error generando PDF:', error);
        res.status(500).json({ error: 'Error al generar el reporte PDF' });
    }
};

export const generarReportePorClienteId = async (req, res) => {
    try {
        const { clienteId } = req.params;

        // Obtener datos del cliente
        const cliente = await obtCliente(clienteId);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        // Crear documento PDF
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="reporte-cliente-${clienteId}.pdf"`);

        doc.pipe(res);

        // Encabezado
        doc.fontSize(20).font('Helvetica-Bold').text('CLÍNICA VETERINARIA', { align: 'center' });
        doc.fontSize(12).font('Helvetica').text('Reporte de Cliente', { align: 'center' });
        doc.moveDown();

        // Línea separadora
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown();

        // Información del Cliente
        doc.fontSize(11).font('Helvetica-Bold').text('INFORMACIÓN DEL CLIENTE');
        doc.fontSize(10).font('Helvetica');
        doc.text(`Nombre: ${cliente.nombre} ${cliente.apellido}`);
        doc.text(`Email: ${cliente.email || 'N/A'}`);
        doc.text(`Teléfono: ${cliente.telefono || 'N/A'}`);
        doc.text(`Dirección: ${cliente.direccion || 'N/A'}`);
        doc.text(`Fecha de Registro: ${new Date(cliente.fecha_creacion).toLocaleDateString('es-ES')}`);
        doc.moveDown();

        // Pie de página
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica-Oblique').text(
            `Reporte generado el ${new Date().toLocaleString('es-ES')}`,
            { align: 'center' }
        );

        doc.end();
    } catch (error) {
        console.error('Error generando reporte:', error);
        res.status(500).json({ error: 'Error al generar el reporte PDF' });
    }
};
