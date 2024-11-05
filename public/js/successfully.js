// Place Order
$(".place-order").on("click", () => {
    $(".place-order").addClass("order-placed");
    setTimeout(() => {
      $(".notification")
        .slideDown({
          start: function () {
            $(this).css({
              display: "flex"
            });
          }
        })
        .html("Placing Your Order");
    }, 1000);
  
    // Mock Order Confirmation
    setTimeout(() => {
      $("section").addClass("order-confirmed");
      $(".notification").html("Order In Transit");
      $("a.back-action").fadeIn();
    }, 4000);
  });
  
  // Repeat-Action
  $("a.back-action").on("click", () => {
    $("a.back-action").fadeOut();
    $("section").removeClass("order-confirmed");
    $(".place-order").removeClass("order-placed");
    $(".notification").slideUp();
  });
  