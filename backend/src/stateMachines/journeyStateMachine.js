const { createMachine, createActor } = require("xstate");

const farmerJourneyMachine = createMachine({
    id: "farmerJourney",
    initial: "idle",
    states: {
        idle: {
            on: { SEEDING: "seeding" }
        },
        seeding: {
            on: { 
                WATERING: "watering"
            }
        },
        watering: {
            on: { 
                WATERING: "watering",
                FERTILIZER: "fertilizer"
            }
        },
        fertilizer: {
            on: { 
                FERTILIZER: "fertilizer",
                PESTICIDE: "pesticide",
                HARVEST: "harvest"
            }
        },
        pesticide: {
            on: { 
                PESTICIDE: "pesticide",
                HARVEST: "harvest"
            }
        },
        harvest: {
            on: { PACKED: "packed" }
        },
        packed: {
            on: { SHIPPED: "shipped" }
        },
        shipped: {
            type: "final"
        }
    }
});

function getAllowedActivities(currentState) {
    const stateNode = farmerJourneyMachine.states[currentState];
    if (!stateNode || !stateNode.on) return [];
    return Object.keys(stateNode.on);
}

function canDoActivity(currentState, activityType) {
    const allowed = getAllowedActivities(currentState);
    return allowed.includes(activityType);
}

function getNextState(currentState, activityType) {
    const stateNode = farmerJourneyMachine.states[currentState];
    if (!stateNode || !stateNode.on) return currentState;
    return stateNode.on[activityType] || currentState;
}

function isJourneyComplete(currentState) {
    return currentState === "shipped";
}

function getStateLabel(state) {
    const labels = {
        idle: "Not Started",
        seeding: "Seeds Planted",
        watering: "Watering Phase",
        fertilizer: "Fertilizing Phase",
        pesticide: "Pest Control Phase",
        harvest: "Harvested",
        packed: "Packed",
        shipped: "Shipped"
    };
    return labels[state] || state;
}

module.exports = {
    farmerJourneyMachine,
    getAllowedActivities,
    canDoActivity,
    getNextState,
    isJourneyComplete,
    getStateLabel
};
