export function getRate(experience: string) {
  switch (experience) {
    case "Over 1 year":
      return 12;
    case "Less 6 months":
      return 9;
    case "Less 1 year":
      return 10;
    default:
      return 6;
  }
}

export function getRateForClient(experience: string) {
  switch (experience) {
    case "Without experience":
      return 12;
    case "Less 6 months":
      return 13;
    case "Less 1 year":
      return 14;
    default:
      return 16;
  }
}

export function calculateAvarageScore(
  cv: number,
  technical: number,
  general: number,
) {
  console.log(
    "CV SCORE",
    cv,
    " TECHNICAL SCORE ",
    technical,
    " GENERAL SCORE ",
    general,
  );
  // // Verificar que los argumentos son números y están dentro del rango de 0 a 100
  // if (
  //   typeof cv !== "number" ||
  //   typeof technical !== "number" ||
  //   typeof general !== "number" ||
  //   cv < 0 ||
  //   cv > 100 ||
  //   technical < 0 ||
  //   technical > 100 ||
  //   general < 0 ||
  //   general > 100
  // ) {
  //   return "Error: the params should be between 0 y 100";
  // }

  let scoreFinal = 0;

  const cvRepresent = 0.4;
  const technicalRepresent = 0.25;
  const generalRepresent = 0.35;
  scoreFinal =
    cv * cvRepresent +
    technical * technicalRepresent +
    general * generalRepresent;

  // Redondear la nota final a dos decimales y devolverla
  return Math.round(scoreFinal * 100) / 100;
}
