document.addEventListener("DOMContentLoaded", () => {
  // =====================
  // INPUT ELEMENTS
  // =====================
  const amount = document.querySelector("#amount");
  const term = document.querySelector("#term-amount");
  const interest = document.querySelector("#in-rate-amount");
  const btn = document.querySelector(".btn-primary");

  // =====================
  // ALERTS
  // =====================
  const alert1 = document.getElementById("alert1");
  const alert2 = document.getElementById("alert2");
  const alert3 = document.getElementById("alert3");
  const alert4 = document.getElementById("alert4");

  // =====================
  // RADIO
  // =====================
  const radios = document.querySelectorAll("input[name='mortgageType']");
  const radioCards = document.querySelectorAll(".radio-card");

  // =====================
  // WRAPPERS
  // =====================
  const wrapperAmount = amount.closest(".input-group");
  const wrapperTerm = term.closest(".input-group");
  const wrapperRate = interest.closest(".input-group");

  // =====================
  // RESULT / EMPTY
  // =====================
  const emptyBox = document.querySelector(".empty");
  const completeBox = document.querySelector(".complete");

  // =====================
  // HELPERS
  // =====================
  function resetErrors() {
    [wrapperAmount, wrapperTerm, wrapperRate].forEach((w) =>
      w.classList.remove("is-error"),
    );

    radioCards.forEach((card) => card.classList.remove("radio-error"));

    [alert1, alert2, alert3, alert4].forEach((a) => (a.textContent = ""));
  }

  function getSelectedType() {
    let selected = null;
    radios.forEach((radio) => {
      if (radio.checked) selected = radio.value;
    });
    return selected;
  }

  // =====================
  // SUBMIT
  // =====================
  btn.addEventListener("click", () => {
    resetErrors();

    let valid = true;

    if (amount.value.trim() === "") {
      wrapperAmount.classList.add("is-error");
      alert1.textContent = "This field is required";
      valid = false;
    }

    if (term.value.trim() === "") {
      wrapperTerm.classList.add("is-error");
      alert2.textContent = "This field is required";
      valid = false;
    }

    if (interest.value.trim() === "") {
      wrapperRate.classList.add("is-error");
      alert3.textContent = "This field is required";
      valid = false;
    }

    const selectedType = getSelectedType();
    if (!selectedType) {
      alert4.textContent = "Please select a mortgage type";
      radioCards.forEach((card) => card.classList.add("radio-error"));
      valid = false;
    }

    // =====================
    // SUCCESS
    // =====================
    if (valid) {
      emptyBox.classList.add("hidden");
      completeBox.classList.remove("hidden");
      completeBox.style.display = "flex";

      console.log("FORM OK", {
        amount: amount.value,
        term: term.value,
        interest: interest.value,
        type: selectedType,
      });
    }

    // COUNT
    if (valid && selectedType === "repayment") {
      const P = Number(amount.value);
      const years = Number(term.value);
      const annualRate = Number(interest.value) / 100;

      const r = annualRate / 12; // bunga per bulan
      const n = years * 12; // total bulan

      function calculateRepayment(P, r, n) {
        return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const monthly = calculateRepayment(P, r, n);
      const total = monthly * n;

      // =====================
      // DISPLAY RESULT
      // =====================
      document.querySelector("#rTop").textContent = "Your monthly repayments";
      document.querySelector("#rBot").textContent =
        "Total you'll repay over the term";

      document.querySelector(".currency").textContent =
        "£" +
        monthly.toLocaleString("en-GB", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

      document.querySelector(".total").textContent =
        "£" +
        total.toLocaleString("en-GB", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
    }

    if (valid && selectedType && selectedType == "interest-only") {
      const principalAmount = Number(amount.value);
      const loanTermYears = Number(term.value);
      const annualInterestRate = Number(interest.value) / 100;

      const monthlyRate = annualInterestRate / 12;
      const totalMonths = loanTermYears * 12;

      let monthlyPayment = 0;
      let totalRepayment = 0;

      if (selectedType === "repayment") {
        monthlyPayment =
          (principalAmount *
            monthlyRate *
            Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);
        totalRepayment = monthlyPayment * totalMonths;
      } else if (selectedType === "interest-only") {
        monthlyPayment = principalAmount * monthlyRate;
        totalRepayment = monthlyPayment * totalMonths + principalAmount;
      }

      // =====================
      // DISPLAY RESULTS
      // =====================

      // Update Labels
      document.querySelector("#rTop").textContent = "Your monthly repayments";
      document.querySelector("#rBot").textContent =
        selectedType === "repayment"
          ? "Total you'll repay over the term"
          : "Total interest plus original loan";

      // Format and Display Monthly Payment
      document.querySelector(".currency").textContent =
        "£" +
        monthlyPayment.toLocaleString("en-GB", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

      // Format and Display Total Amount
      document.querySelector(".total").textContent =
        "£" +
        totalRepayment.toLocaleString("en-GB", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
    }
  });
});
