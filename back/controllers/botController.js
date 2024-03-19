const Bot = require('../model/Bot');
const { uploadFile, deleteFile } = require('../middleware/file');
const scheduler = require('node-schedule');

const getAllBots = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || null;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const searchOption = req.query.searchOption || 'all';

    try {
        let query = {};
        if (search !== '') {
            if (searchOption === 'all') {
                query = {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { status: { $regex: search, $options: 'i' } }
                    ]
                };
            } else {
                query[searchOption] = { $regex: search, $options: 'i' };
            }
        }


        const bots = await Bot.find(query)
            .skip(skip)
            .limit(limit);


        const totalBots = await Bot.countDocuments(query);

        if (!bots || bots.length === 0) {
            return res.status(204).json({ 'message': 'No bots found' });
        }

        res.json({
            bots,
            currentPage: page,
            totalPages: Math.ceil(totalBots / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Internal server error' });
    }
};


const createBot = async (req, res) => {
    const { newName, description } = req.body;
    const name = newName;
    const file = req.file;
    const status = 'inactive'
    if (!name || !description || !file) {
        return res.status(400).json({ 'message': 'Missing required fields' });
    }
    try {
        const bot = await Bot.findOne({ name }).exec();
        if (bot) return res.status(400).json({ 'message': 'Bot name already exists' });

        const data = await uploadFile(file, "configuration");
        const { path, downloadURL } = data;

        if (data?.status === 500) return res.status(500).json({ 'message': 'Internal server error' });

        const newBot = new Bot({
            name,
            description,
            configuration: { downloadURL, path },
            status
        });

        const result = await newBot.save();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Internal server error' });
    }
};

const deleteBot = async (req, res) => {
    if (!req?.params?.name) return res.status(400).json({ "message": 'Bot name required' });

    try {
        const bot = await Bot.findOne({ name: req.params.name }).exec();

        if (!bot) {
            return res.status(404).json({ 'message': `Bot name ${req.params.name} not found` });
        }

        const filePath = bot.configuration.path;

        const result = await bot.deleteOne({ name: req.params.name });

        await deleteFile(filePath);

        return res.json(result);
    } catch (error) {
        console.error('Error deleting bot:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const getBot = async (req, res) => {
    if (!req?.params?.name) return res.status(400).json({ "message": 'Bot name required' });
    try {
        const bot = await Bot.findOne({ name: req.params.name }).exec();
        if (!bot) {
            return res.status(404).json({ 'message': `Bot name ${req.params.name} not found` });
        }
        res.json(bot);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Internal server error' });
    }
}

const updateBot = async (req, res) => {
    if (!req?.params?.name) return res.status(400).json({ "message": 'Bot name required' });
    const name = req.params.name;
    const bot = await Bot.findOne({ name: req.params.name }).exec();
    if (!bot) {
        return res.status(404).json({ 'message': `Bot name ${req.params.name} not found` });
    }
    const { newName, description } = req.body;
    const file = req.file;

    if (!newName || !description) {
        return res.status(400).json({ 'message': 'Missing required fields' });
    }
    try {
        const existingBot = await Bot.findOne({ name }).exec();
        if (!existingBot) {
            return res.status(404).json({ 'message': `Bot with name ${name} not found` });
        }
        const namechanged = existingBot.name !== newName;
        if (namechanged) {
            const bot = await Bot.findOne({ name: newName }).exec();
            if (bot) return res.status(400).json({ 'message': `Name ${newName} already exists` });
        }

        existingBot.name = newName;
        existingBot.description = description;
        if (file) {
            if (existingBot.configuration.path) {
                const filePath = existingBot.configuration.path;
                await deleteFile(filePath);
            }
            const data = await uploadFile(file, "configuration");
            const { path, downloadURL } = data;
            if (data?.status === 500) return res.status(500).json({ 'message': 'Internal server error' });
            existingBot.configuration = { downloadURL, path };
        }
        const result = await existingBot.save();
        res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ 'message': 'Internal server error' });
    }
}


const configureBot = async (req, res) => {
    const { file } = req.body;
    if (!file) return res.status(400).json({ 'message': 'File required' });
    //verify file
    //save file
    //save bot


}

const scheduleBot = async (req, res) => {
    const { name, schedule } = req.body;

    console.log('scheduleBot:', name, schedule);

    if (!name || !schedule) return res.status(400).json({ 'message': 'Name and schedule required' });

    try {
        const bot = await Bot.findOne({ name }).exec();
        if (!bot) {
            return res.status(404).json({ 'message': `Bot name ${name} not found` });
        }

        const scheduleDate = new Date(schedule);

        console.log('scheduleDate  :', scheduleDate, 'new data ', new Date(), scheduleDate > new Date());
        console.log('schedule ', schedule, schedule > new Date());

        if (scheduleDate < new Date()) {
            return res.status(400).json({ 'message': 'Invalid schedule date' });
        }

        if (bot.isScheduled) {
            return res.status(400).json({ 'message': `Bot ${name} is already scheduled` });
        }



        const job = scheduler.scheduleJob(name, schedule, async function () {
            try {
                if (bot.status === 'active') {
                    job.cancel();
                    console.log(`Bot ${name} was already running`);
                }
                bot.status = 'active';
                await bot.save();
                console.log('Running bot:', name);
            } catch (error) {
                console.error('Error running bot:', error);
            }
        });
        bot.isScheduled = true;
        bot.schedule = schedule;
        await bot.save();

        return res.json({ 'message': `Bot ${name} scheduled` });
    } catch (error) {
        console.error('Error scheduling bot:', error);
        return res.status(500).json({ 'message': 'Internal server error' });
    }
};


const runOrStopBot = async (req, res) => {
    const { name, status } = req.body;
    if (!name || !status) return res.status(400).json({ 'message': 'Name and status required' });
    const bot = await Bot.findOne({ name }).exec();
    if (!bot) {
        return res.status(404).json({ 'message': `Bot name ${name} not found` });
    }
    if (bot.status === status) return res.status(400).json({ 'message': `Bot is already ${status}` });
    bot.status = status;
    const result = await bot.save();
    res.json(result);
}




module.exports = {
    getAllBots,
    createBot,
    deleteBot,
    getBot,
    updateBot,
    runOrStopBot,
    scheduleBot
};