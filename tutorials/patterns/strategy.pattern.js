function calculateCost(type, weight) {
    if (type === "standard") {
      return weight * 1.5;
    } else if (type === "express") {
      return weight * 3.0;
    } else if (type === "overnight") {
      return weight * 5.0;
    } else if(type === 'default') {
        return weight
    }
  }

const standardCost = (weight)=> weight * 1.5;
const expressCost = (weight)=> weight * 3.0;
const overnightCost = (weight)=> weight * 5.0;
const defaultCost = (weight)=> weight;

const getCostStrategies= {
      standard: standardCost,
      express: expressCost,
      overnight: overnightCost,
      default : defaultCost
  }

function calculateCost(type, weight) {
    return getCostStrategies[type](weight);
  }