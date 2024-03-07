const submitBtn = document.querySelector("#submit-btn");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const emailAddress = document.querySelector("#email-address").value;
  const amountToPay = document.querySelector("#amount").value;
  let handler = PaystackPop.setup({
    key: "pk_test_f812709139a9f2976dbff79fc10d6ff33fa7d140",
    email: emailAddress,
    amount: amountToPay * 100,
    ref: "" + Math.floor(Math.random() * 1000000000 + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
    onClose: function () {
      alert("Window closed.");
    },
    callback: function (response) {
      let message = "Payment complete! Reference: " + response.reference;
      alert(message);
    },
  });
  handler.openIframe();
});
