const searchService = require('../services/search.service');

const search = async (req, res) => {
    try {
        const keyword = req.query.keywords;
        console.log(keyword)
        if (!keyword) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const results = await searchService.searchSongsAndUsers(keyword);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { search };
