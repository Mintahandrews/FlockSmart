import { AppData } from '../types';
import { Squircle, Lightbulb, TrendingUp } from 'lucide-react';

interface AIInsightsProps {
  data: AppData;
  type: 'feed' | 'health' | 'production' | 'financial';
}

const AIInsights = ({ data, type }: AIInsightsProps) => {
  const getInsights = () => {
    switch (type) {
      case 'feed':
        return getFeedInsights();
      case 'health':
        return getHealthInsights();
      case 'production':
        return getProductionInsights();
      case 'financial':
        return getFinancialInsights();
      default:
        return [];
    }
  };

  const getFeedInsights = () => {
    const insights = [];
    
    // Check for feed efficiency
    const layerFlocks = data.flocks.filter(f => f.birdType === 'Layer');
    const broilerFlocks = data.flocks.filter(f => f.birdType === 'Broiler');
    
    if (layerFlocks.length > 0) {
      insights.push({
        type: 'suggestion',
        content: 'Layer hens need 16-18% protein content in their feed for optimal egg production.'
      });
    }
    
    if (broilerFlocks.length > 0) {
      insights.push({
        type: 'suggestion',
        content: 'For faster growth, broilers should receive 22-24% protein starter feed until 3 weeks of age.'
      });
    }

    // Check feed costs
    const recentFeedRecords = data.feedRecords.slice(0, 3);
    if (recentFeedRecords.length >= 2) {
      const avgCost = recentFeedRecords.reduce((sum, r) => sum + r.costPerKg, 0) / recentFeedRecords.length;
      if (avgCost > 0.85) {
        insights.push({
          type: 'alert',
          content: 'Feed costs are above average. Consider bulk purchases or alternative suppliers.'
        });
      }
    }

    return insights;
  };

  const getHealthInsights = () => {
    const insights = [];
    
    // Check flock health status
    const poorHealthFlocks = data.flocks.filter(f => f.healthStatus === 'Poor' || f.healthStatus === 'Fair');
    if (poorHealthFlocks.length > 0) {
      insights.push({
        type: 'alert',
        content: `${poorHealthFlocks.length} flocks require health attention. Isolate affected birds and monitor for symptoms.`
      });
    }
    
    // Check mortality rates
    const totalMortality = data.mortalityRecords.reduce((sum, r) => sum + r.count, 0);
    const totalBirds = data.flocks.reduce((sum, f) => sum + f.count, 0);
    const mortalityRate = totalBirds > 0 ? (totalMortality / (totalBirds + totalMortality)) * 100 : 0;
    
    if (mortalityRate > 5) {
      insights.push({
        type: 'alert',
        content: 'Mortality rate is above 5%. Consider consulting a veterinarian and reviewing biosecurity measures.'
      });
    } else {
      insights.push({
        type: 'trend',
        content: 'Mortality rate is within acceptable limits. Continue monitoring flock health daily.'
      });
    }
    
    return insights;
  };

  const getProductionInsights = () => {
    const insights = [];
    
    // Analyze egg production trends
    if (data.eggProduction.length >= 3) {
      const recent = data.eggProduction[0].quantity;
      const previous = data.eggProduction[2].quantity;
      const percentChange = ((recent - previous) / previous) * 100;
      
      if (percentChange <= -10) {
        insights.push({
          type: 'alert',
          content: `Egg production has decreased by ${Math.abs(percentChange).toFixed(1)}%. Check for health issues or stress factors.`
        });
      } else if (percentChange >= 10) {
        insights.push({
          type: 'trend',
          content: `Egg production has increased by ${percentChange.toFixed(1)}%. Your management changes are working well.`
        });
      }
    }
    
    // Check for layer flock age
    const oldLayerFlocks = data.flocks.filter(f => f.birdType === 'Layer' && f.ageWeeks > 72);
    if (oldLayerFlocks.length > 0) {
      insights.push({
        type: 'suggestion',
        content: 'Some layer flocks are aging. Consider planning for flock replacement in the coming months.'
      });
    }
    
    return insights;
  };

  const getFinancialInsights = () => {
    const insights = [];
    
    // Calculate profitability
    const revenue = data.salesRecords.reduce((sum, r) => sum + (r.quantity * r.unitPrice), 0);
    const expenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
    const profit = revenue - expenses;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
    
    if (profitMargin < 0) {
      insights.push({
        type: 'alert',
        content: 'Your operation is currently running at a loss. Review expenses and consider ways to increase revenue.'
      });
    } else if (profitMargin < 15) {
      insights.push({
        type: 'suggestion',
        content: 'Profit margin is below industry average. Focus on reducing your highest expense category.'
      });
    } else {
      insights.push({
        type: 'trend',
        content: `Good profit margin of ${profitMargin.toFixed(1)}%. Consider reinvesting in farm expansion.`
      });
    }
    
    // Analyze expense categories
    const expensesByCategory: Record<string, number> = {};
    data.expenses.forEach(e => {
      expensesByCategory[e.category] = (expensesByCategory[e.category] || 0) + e.amount;
    });
    
    const sortedExpenses = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);
    if (sortedExpenses.length > 0) {
      const [topCategory, amount] = sortedExpenses[0];
      const percentage = (amount / expenses) * 100;
      
      if (percentage > 60) {
        insights.push({
          type: 'alert',
          content: `${topCategory} represents ${percentage.toFixed(0)}% of your expenses. This concentration increases risk.`
        });
      }
    }
    
    return insights;
  };

  const insights = getInsights();

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mt-4">
      <h3 className="text-md font-semibold mb-3 flex items-center">
        <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
        AI Insights
      </h3>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg flex items-start ${
              insight.type === 'alert' ? 'bg-red-50' :
              insight.type === 'trend' ? 'bg-green-50' :
              'bg-blue-50'
            }`}
          >
            {insight.type === 'alert' ? (
              <Squircle className="h-5 w-5 mr-2 text-red-500 mt-0.5" />
            ) : insight.type === 'trend' ? (
              <TrendingUp className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
            ) : (
              <Lightbulb className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
            )}
            <p className="text-sm">{insight.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
