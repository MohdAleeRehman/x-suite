// Format AED amount
export const fmt = (n) => 'AED ' + Math.round(n).toLocaleString('en-AE')

// Format percentage
export const pct = (n) => (Math.round(n * 10) / 10) + '%'

// Format negative AED
export const minus = (n) => '– AED ' + Math.round(n).toLocaleString('en-AE')

// Format date for display
export const formatDateLocal = (dateObj) => {
  return dateObj.toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Get today's date as YYYY-MM-DD string
export const todayStr = () => new Date().toISOString().split('T')[0]

// ===== SALE CALCULATIONS =====
export const calculateSaleResults = (inputs) => {
  const {
    origPrice, sellPrice, propStatus, paidType, paidVal,
    dldPct, sldBasePct, sldSellPct, nocFee, spaFee, titleDeed,
    bcType, bcVal, scType, scVal,
    hasUtil, uWater, uGas, uElec, uFire, payerMap
  } = inputs

  const orig = parseFloat(origPrice) || 0
  const sell = parseFloat(sellPrice) || 0
  const isOP = propStatus === 'offplan'

  let paidDev = 0
  if (isOP) {
    const pv = parseFloat(paidVal) || 0
    paidDev = paidType === 'pct' ? (orig * pv / 100) : pv
  } else {
    paidDev = orig
  }

  const devBal = isOP ? (orig - paidDev) : 0
  const equityToSeller = sell - devBal

  const dld = parseFloat(dldPct) || 0
  const dldFee = sell * (dld / 100)
  const tdFee = parseFloat(titleDeed) || 0
  const spa = parseFloat(spaFee) || 0

  const bcV = parseFloat(bcVal) || 0
  const bComm = bcType === 'pct' ? (sell * (bcV / 100) * 1.05) : (bcV * 1.05)

  let bUtil = 0, sUtil = 0
  if (hasUtil) {
    const utils = [
      { key: 'Water', val: parseFloat(uWater) || 0 },
      { key: 'Gas', val: parseFloat(uGas) || 0 },
      { key: 'Elec', val: parseFloat(uElec) || 0 },
      { key: 'Fire', val: parseFloat(uFire) || 0 }
    ]
    utils.forEach(({ key, val }) => {
      if (payerMap[key] === 'buyer') bUtil += val
      else sUtil += val
    })
  }

  const buyerTotal = equityToSeller + devBal + dldFee + tdFee + spa + bComm + bUtil

  const sldBase = parseFloat(sldBasePct) || 0
  const sldSell = parseFloat(sldSellPct) || 0
  const sldBaseFee = sell * (sldBase / 100)
  const sldSellFee = sell * (sldSell / 100)
  const sldTotal = sldBaseFee + sldSellFee

  const noc = parseFloat(nocFee) || 0
  const scV = parseFloat(scVal) || 0
  const sComm = scType === 'pct' ? (sell * (scV / 100) * 1.05) : (scV * 1.05)

  const totalSellerCosts = sldTotal + noc + sComm + sUtil
  const netSeller = equityToSeller - totalSellerCosts
  const assetPremium = sell - orig
  const apprec = orig > 0 ? (assetPremium / orig) * 100 : 0
  const premPct = sell > 0 ? ((buyerTotal - sell) / sell) * 100 : 0
  const yieldOnCost = orig > 0 ? (netSeller / orig) * 100 : 0
  const totalFriction = dldFee + tdFee + spa + bComm + bUtil + totalSellerCosts - sUtil
  const fricPct = sell > 0 ? (totalFriction / sell) * 100 : 0

  const graphOrigPercent = sell > 0 ? Math.min((orig / Math.max(buyerTotal, sell)) * 100, 100) : 0
  const graphSellPercent = sell > 0 ? Math.min((sell / Math.max(buyerTotal, sell)) * 100, 100) : 0
  const graphBuyerPercent = buyerTotal > 0 ? 100 : 0

  const utilNote = hasUtil && (bUtil + sUtil > 0)
    ? ` Meter and handover costs of <strong>${fmt(bUtil + sUtil)}</strong> were split — the buyer pays <strong>${fmt(bUtil)}</strong> and the seller clears <strong>${fmt(sUtil)}</strong>.`
    : ''

  const summaryPara = `The property was originally bought for <strong>${fmt(orig)}</strong> and resold for <strong>${fmt(sell)}</strong>, giving a total gross price increase of <strong class="${assetPremium >= 0 ? 'hl-green' : 'hl-red'}">${fmt(assetPremium)}</strong>. After subtracting all closing costs, including Sharjah Land Department fees of <strong>${fmt(sldTotal)}</strong>, real estate agent commissions of <strong>${fmt(sComm + bComm)}</strong>, and NOC administrative outlays, the seller retains a clean terminal liquidity posture of <strong>${fmt(netSeller)}</strong>. The buyer required an all-inclusive equity deployment of <strong>${fmt(buyerTotal)}</strong> to assume asset control.${utilNote} Institutional deal friction consumed <strong>${fmt(totalFriction)}</strong> representing <strong>${pct(fricPct)}</strong> of absolute value.`

  return {
    // Buyer tab
    sell, orig, equityToSeller, devBal, dldFee, dld, tdFee, spa, bUtil, bComm, buyerTotal, premPct,
    // Seller tab
    assetPremium, sldBase, sldSell, sldBaseFee, sldSellFee, sldTotal, noc, sUtil, sComm, totalSellerCosts, netSeller,
    // Summary tab
    apprec, yieldOnCost, fricPct, totalFriction,
    // Graph
    graphOrigPercent, graphSellPercent, graphBuyerPercent,
    summaryPara,
    // For display labels
    sldBaseLabel: sldBase, sldSellLabel: sldSell
  }
}

// ===== RENT CALCULATIONS =====
export const calculateRentResults = (inputs) => {
  const { rentAnnual, rentCheques, rentSewa, rentFurnished, rcType, rcVal, rentStartDate } = inputs

  const annualRent = parseFloat(rentAnnual) || 0
  const numCheques = parseInt(rentCheques) || 1
  const sewa = parseFloat(rentSewa) || 0
  const rcV = parseFloat(rcVal) || 0

  const attestFee = annualRent * 0.04
  const secPct = rentFurnished === 'furnished' ? 0.10 : 0.05
  const securityDeposit = annualRent * secPct
  const baseComm = rcType === 'pct' ? (annualRent * (rcV / 100)) : rcV
  const commWithVat = baseComm * 1.05
  const singleChequeAmt = annualRent / numCheques
  const immediateCashNeeded = singleChequeAmt + attestFee + sewa + securityDeposit + commWithVat
  const completeYearlyFinancialCommitment = annualRent + attestFee + sewa + securityDeposit + commWithVat

  // Cheque schedule
  let baseDate = rentStartDate ? new Date(rentStartDate) : new Date()
  const cheques = []
  if (numCheques > 1) {
    const monthIntervalStep = 12 / numCheques
    for (let i = 2; i <= numCheques; i++) {
      let nextChequeDate = new Date(baseDate)
      nextChequeDate.setMonth(nextChequeDate.getMonth() + Math.round((i - 1) * monthIntervalStep))
      cheques.push({
        number: i,
        date: formatDateLocal(nextChequeDate),
        amount: singleChequeAmt
      })
    }
  }

  return {
    annualRent, numCheques, attestFee, secPct, securityDeposit, sewa, commWithVat,
    singleChequeAmt, immediateCashNeeded, completeYearlyFinancialCommitment,
    firstChequeDate: formatDateLocal(baseDate),
    cheques
  }
}

// ===== PROPERTY PROFILE (no calculations needed, just display) =====
export const buildPropTitle = (dataset) => {
  return `Prop: ${dataset.pBuilding} (Unit ${dataset.pUnit})`
}
