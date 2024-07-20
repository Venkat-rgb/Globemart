// Order invoice template used for sending mail to customer when order is placed
export const orderInvoiceTemplate = (invoiceInfo) => {
  try {
    const {
      subTotalAmount,
      shippingAmount,
      gstAmount,
      finalTotalAmount,
      currency,
      invoiceProducts,
      couponPrice,
      paymentMode,
    } = invoiceInfo;

    let invoice = `
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
        rel="stylesheet"
      />
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
     </style>
    </head>
    <body>
      <div style="font-family: Inter, sans-serif; padding: 1.2rem">
        <p style="font-size: 1.15rem; margin-bottom: 3rem">
          
        ${
          paymentMode === "online"
            ? "Your Payment was successful and your order has been placed successfully!"
            : "Your Order has been placed successfully!"
        }
        
        </p>
  
        <p style="font-size: 1.35rem; font-weight: 500; padding-bottom: 1rem">
          Ordered Items
        </p>
  
        <table
          border="1"
          style="width: 100%; padding-top: 4rem; border-collapse: collapse"
        >
          <tr style="border: 1px solid grey; background-color: #f1f1f1">
            <th style="text-align: start; padding: 10px">Product Name</th>
            <th style="text-align: start; padding: 10px">Quantity</th>
            <th style="text-align: start; padding: 10px">Price</th>
            <th style="text-align: start; padding: 10px">Ordered Date</th>
          </tr>
  `;

    invoiceProducts.forEach((product) => {
      invoice += `<tr style="border:1px solid grey;">
                      <td style="text-align:start; padding:10px;">
                          ${product?.productName}
                      </td>
                      <td style="text-align:start; padding:10px;">${product?.quantity}</td>
                      <td style="text-align:start; padding:10px;">${product?.price}</td>
                      <td style="text-align:start; padding:10px;">${product?.orderedDate}</td>
                  </tr>`;
    });

    invoice += `
      </table>
      <div style="padding-top: 2rem; width: 100%; text-align: right">
        <p style="padding-top: 1rem">
          <span style="font-weight: 600; font-size: 1.15rem">Subtotal : </span>
          <span style="font-size: 1rem">${subTotalAmount} ${currency} (+)</span>
        </p>
        <p style="padding-top: 1rem">
          <span style="font-weight: 600; font-size: 1.15rem">Shipping : </span>
          <span style="font-size: 1rem">${shippingAmount} ${currency} (+)</span>
        </p>
        <p style="padding-top: 1rem">
          <span style="font-weight: 600; font-size: 1.15rem">GST : </span>
          <span style="font-size: 1rem">${gstAmount} ${currency} (+)</span>
        </p>
        ${
          couponPrice
            ? `<p style="padding-top: 1rem">
              <span style="font-weight: 600; font-size: 1.15rem">Coupon Discount: </span>
              <span style="font-size: 1rem">${couponPrice} ${currency} (-)</span>
          </p>`
            : `<div style="display: none"></div>`
        }
        <p style="border-bottom: 1px solid lightgrey; padding-bottom: 1rem; padding-top: 1rem">
          <span style="font-weight: 600; font-size: 1.15rem">Payment Mode : </span>
          <span style="font-size: 1rem">${
            paymentMode === "online"
              ? "Stripe (Online)"
              : "Cash on Delivery (Offline)"
          } </span>
        </p>          
        <p style="padding-top: 1rem">
          <span style="font-weight: 600; font-size: 1.25rem">Total : </span>
          <span style="font-size: 1.1rem"> 
            ${finalTotalAmount} ${currency} (${
      paymentMode === "online" ? "Paid" : "To be Paid"
    })
          </span>
        </p>
      </div>
      <p style="text-align: center; margin-top: 3rem; font-size: 1.4rem">
          Thanks for shopping on Ecommercy, visit again!
      </p>
    </div>
  </body>
  </html>
  `;

    return invoice;
  } catch (err) {
    console.log("orderInvoiceTemplate function error: ", err?.message);
  }
};
