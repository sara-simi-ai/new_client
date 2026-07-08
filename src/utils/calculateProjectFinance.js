/**
 * מחשב תקציבים, סך הכל ופערים עבור פרויקט בודד ומאחד שמות שדות
 */

import { STATUS_PAAR } from '../constants/constants';

const ACHUZEY_PEARIM = Number(process.env.REACT_APP_STATUS_PAAR_THRESHOLD_PERCENT) || 10;

export const calculateProjectFinance = (project) => {

  const totalTakzivCoachAdam = project?.totalTakzivCoachAdam || project?.totalTakzuvCoachAdam || 0;
  const totalTakzivRechesh   = project?.totalTakzivRechesh || 0;
  const coachAdam            = project?.coachAdam || 0;

  const totalTaktziv = totalTakzivCoachAdam + totalTakzivRechesh;

  const pearim = totalTakzivCoachAdam - coachAdam;

  // avoid division by zero / exploding percentages
  const achuzPearim = (coachAdam > 0 && totalTakzivCoachAdam > 0)
    ? (pearim / totalTakzivCoachAdam) * 100
    : 0;

  let statusPearim = STATUS_PAAR.TAKIN;

  if (pearim === 0) {
    statusPearim = STATUS_PAAR.TAKIN;
  } else if (Math.abs(achuzPearim) >= ACHUZEY_PEARIM || coachAdam === 0) {
    statusPearim = pearim < 0 ? STATUS_PAAR.GERAON : STATUS_PAAR.ODEF;
  }

  return {
    totalTakzivCoachAdam,
    totalTakzuvCoachAdam: totalTakzivCoachAdam,
    totalTakzivRechesh,
    coachAdam,
    totalTaktziv,
    pearim,
    achuzPearim: Math.round(Math.abs(achuzPearim)),
    statusPearim,
  };
};