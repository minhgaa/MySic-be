const reportService = require('../services/report.service');

const getReports = async(req, res) => {
    try {
        const reports = await reportService.getReports();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createReport = async(req, res) => {
    try {
        const data = req.body;
        const report = await reportService.createReport(data);
        res.status(201).json({ message: "Report created successfully", report});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteReport = async(req, res) => {
    try {
        const { id } = req.params;
        await reportService.deleteReport(id);
        res.status(200).json({ message: "Report deleted successfully"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getReports, createReport, deleteReport };
