const optimizationEvents = require('./eventEmitter');
const OptimizationModel = require('../models/optimizationModel');

class BackgroundTasks {
    static init() {
        optimizationEvents.on('optimization.created', async (optimization) => {
            try {
                console.log(`Starting background data generation for optimization ID: ${optimization.Id}`);
                await OptimizationModel.generateDummyDataFromPortfolio(optimization.Id);
                console.log(`Completed data generation for optimization ID: ${optimization.Id}`);
            } catch (error) {
                console.error(`Error in background data generation for optimization ID: ${optimization.Id}:`, error);
            }
        });
    }
}

module.exports = BackgroundTasks;
