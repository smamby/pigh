const params = new URLSearchParams(window.location.search);
        const idAlojamiento = params.get('id_alojamiento');

        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        reference_id: "alojamiento123",
                        description: "Reserva alojamiento en Mendoza",
                        custom_id: "reserva_456",   // opcional, para rastreo interno
                        amount: {
                            currency_code: "USD",
                            value: "50.00",
                            breakdown: {
                            item_total: { value: "45.00", currency_code: "USD" },
                            tax_total: { value: "5.00", currency_code: "USD" }
                            }
                        },
                        items: [
                            {
                            name: "Habitación doble con vista",
                            unit_amount: { value: "45.00", currency_code: "USD" },
                            quantity: "1"
                            }
                        ]
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    console.log('Pago completado por', details.payer.name.given_name);

                    // Registrar la reserva en tu backend
                    fetch('http://localhost:3001/api/reservas', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id_alojamiento: idAlojamiento,
                            paypal_order_id: data.orderID,
                            payer_email: details.payer.email_address,
                            nombre: details.payer.name.given_name,
                            apellido: details.payer.name.surname
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        alert('Reserva registrada correctamente');
                        window.location.href = 'confirmacion.html';
                    })
                    .catch(err => {
                        console.error('Error al registrar la reserva:', err);
                        alert('Error al registrar la reserva');
                    });
                });
            }
        }).render('#paypal-button-container');