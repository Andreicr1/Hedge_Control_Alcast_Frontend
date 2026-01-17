/**
 * Services barrel export
 */

import rfqsService from './rfqs.service';
import contractsService from './contracts.service';
import dealsService from './deals.service';
import counterpartiesService from './counterparties.service';
import exposuresService from './exposures.service';
import dashboardService from './dashboard.service';
import salesOrdersService from './salesOrders.service';
import purchaseOrdersService from './purchaseOrders.service';
import pnlService from './pnl.service';

export {
  rfqsService,
  contractsService,
  dealsService,
  counterpartiesService,
  exposuresService,
  dashboardService,
  salesOrdersService,
  purchaseOrdersService,
  pnlService,
};

// Re-export specific functions (avoiding conflicts)
export { formatPnl, calculateDealMargin, groupLegsByType } from './deals.service';
export { 
  getAluminumQuote, 
  getAluminumHistory, 
  getSettlementsToday,
  getSettlementsUpcoming,
  getDashboardSummary,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
  formatDateTime,
  getStatusColor,
} from './dashboard.service';
