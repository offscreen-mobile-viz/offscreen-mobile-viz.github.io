import BoxPlot from '../charts/BoxPlot';
import DotPlot from '../charts/DotPlot'
import Histogram from '../charts/Histogram';
import ViolinPlot from '../charts/ViolinPlot';

export const ChartType = {
  // DOTPLOT40 - a DotPlot chart with 40 points per dot
  DOTPLOT40: 'dotplot-40',
  
  // DOTPLOT100 - a DotPlot chart with 100 points per dot
  DOTPLOT100: 'dotplot-100',
  
  // HISTOGRAM - a Histogram
  HISTOGRAM: 'histogram',

  // BOXPLOT - a bin based BoxPlot 
  BOXPLOT: 'boxplot',

  // VIOLINPLOT - a bin based ViolinPlot
  VIOLINPLOT: 'violinplot'
};
/**
 * chart will hold all possible chart closures based on a specified type.
 * 
 * Usage: chart[ChartType.DOTPLOT40] will render a dotplot with 40 points per dot.
 *        this allows for ease of use to integrate with the type prop. 
 * 
 * chart[type] will return the desired type of chart.
 */
export const Chart = {
  [ChartType.DOTPLOT40]: DotPlot(),
  [ChartType.DOTPLOT100]: DotPlot().pointsPerDot(100),
  [ChartType.HISTOGRAM]: Histogram(),
  [ChartType.BOXPLOT]: BoxPlot(),
  [ChartType.VIOLINPLOT]: ViolinPlot(),
}