window.isPrice = true;
window.filterSubj = "";
window.filterGrade = "";
window.filterGenre = "";
window.filterText = "";
window.isFilterChanged = false;
window.cards = [];

window.onload = function () {
  const requestOptions = {
    method: "POST",
    body: JSON.stringify({ data: "" }),
  };
  fetch("https://krapipl.imumk.ru:8443/api/mobilev1/update", requestOptions)
    .then((res) => res.json())
    .then(
      (res) => succesRequest(res),
      (error) => errorRequest(error)
    );
  const spinner = document.getElementById("spinner");
  if (spinner) spinner.style.display = "flex";
};
function succesRequest(result) {
  if (result.result === "Ok") {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "none";
    cards = [...result.items];
    renderCardList();
    const toggle = document.getElementById("price-toggle");
    toggle.addEventListener("change", handleChangePriceBonus);
  }
}
function renderCardList() {
  isFilterChanged =
    filterSubj !== "" ||
    filterGrade !== "" ||
    filterGenre !== "" ||
    filterText !== "";
  const main = document.getElementById("cards-wrap");
  if (main) {
    while (main.firstChild) main.removeChild(main.firstChild);
    const fragment = new DocumentFragment();
    document.getElementById("result-title").style.display = isFilterChanged
      ? "block"
      : "none";
    const filteredArr = cards.filter((item) => filter(item));
    if (filteredArr.length === 0) {
      document.getElementById("empty-course").style.display = "block";
    } else {
      document.getElementById("empty-course").style.display = "none";
      filteredArr.map((item) => {
        const card = document.getElementById("template").cloneNode(true);
        card.style.display = "block";
        card.key = item.courseId;
        card.id = item.courseId;
        const subject = card.getElementsByClassName("info-title")[0];
        subject.innerHTML = item.subject;
        const grade = card.getElementsByClassName("info-grade")[0];
        grade.innerHTML = formatGrades(item.grade);
        const genre = card.getElementsByClassName("info-genre")[0];
        genre.innerHTML = item.genre;
        const link = card.getElementsByTagName("a");
        for (const a of link) a.href = item.shopUrl;
        const price = card.getElementsByClassName("price")[0];
        price.innerHTML = isPrice
          ? `Цена:${item.price}р.`
          : `Цена(в бонусах):${item.priceBonus}`;
        const img = card.getElementsByTagName("img")[0];
        img.src = `https://www.imumk.ru/svc/coursecover/${item.courseId}`;
        fragment.append(card);
      });
    }
    main.append(fragment);
  }
}
function handleChangeSubject(e) {
  filterSubj = e.value;
  renderCardList();
}
function handleChangeGenre(e) {
  filterGenre = e.value;
  renderCardList();
}
function handleChangeGrade(e) {
  filterGrade = e.value;
  renderCardList();
}
function handleChangeText(e) {
  filterText = e.value;
  renderCardList();
}
const formatGrades = (grades) => {
  const arrGrades = grades.split(";");
  const countGrades = arrGrades.length;
  if (countGrades > 1) {
    return `${arrGrades[0]}-${arrGrades[countGrades - 1]} классы`;
  } else if (countGrades === 1) return `${arrGrades[0]} класс`;
};
const filter = (course) =>
  !(
    (filterSubj !== "" && filterSubj !== course.subject) ||
    (filterGrade !== "" &&
      course.grade.split(";").indexOf(filterGrade) === -1) ||
    (filterGenre !== "" && course.genre !== filterGenre) ||
    (filterText !== "" &&
      course.title.toUpperCase().indexOf(filterText.toUpperCase()) === -1)
  );

function handleChangePriceBonus(e) {
  isPrice = !isPrice;
  cards.map((item) => {
    const card = document.getElementById(item.courseId);
    const price = card?.getElementsByClassName("price")[0];
    if (price)
      price.innerHTML = isPrice
        ? `Цена:${item.price}р.`
        : `Цена(в бонусах):${item.priceBonus}`;
  });
}
const handleToggleClick = (e) => {
  const body = document.querySelector("body");
  if (body)
    body.style.overflow = !e.classList.contains("collapsed") ? "hidden" : "";
};
function errorRequest(error) {
  if (error.result !== "Ok") {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "none";
    const errorMessage = document.createElement("h3");
    errorMessage.innerHTML = error.errorMessage
      ? error.errorMessage
      : "Ошибка загрузки данных.";
    const main = document.getElementById("cards-wrap");
    main.append(errorMessage);
  }
}
