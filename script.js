function val(id) {
    const raw = document.getElementById(id).value.replace(/\./g, "").replace(/[^0-9.-]/g, "");
    return parseFloat(raw) || 0;
}

function formatMoney(n) {
    return '$' + Number(n || 0).toLocaleString('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function formatoFechaInput(fecha) {
    if (fecha) return fecha;
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const camposNumericos = document.querySelectorAll(
        "#formCuadre input[type='number']"
    );

    camposNumericos.forEach(input => {
        input.type = "text";
        input.inputMode = "numeric";

        input.addEventListener("input", e => {
            const pos = e.target.selectionStart;
            const longitudAntes = e.target.value.length;

            let valor = e.target.value.replace(/\D/g, "");

            if (valor) {
                e.target.value = Number(valor).toLocaleString("es-CO");
            } else {
                e.target.value = "";
            }

            const longitudDespues = e.target.value.length;
            e.target.selectionEnd = pos + (longitudDespues - longitudAntes);
        });
    });
});


function generarReporte() {
    const fechaInput = document.getElementById('fecha').value;
    const fecha = formatoFechaInput(fechaInput);

    const total = val('total_venta');
    const propina = val('propina');
    const domicilio = val('domicilio');
    const red = [
        val('red1'), val('red2'), val('red3'),
        val('red4'), val('red5'), val('red6')
    ];
    const transfer = val('transferencias');
    const cxc = val('cuenta_cobrar');
    const gastos = val('gastos');
    const efectivo = val('efectivo_oficina');
    const baseCaja = val('base_caja');

    const subtotal1 = total - propina - domicilio;
    const subtotalRed = red.reduce((a, b) => a + b, 0);
    const subtotal2 = subtotal1 - subtotalRed;
    const subtotal3 = subtotal2 - transfer;
    const subtotal4 = subtotal3 - cxc;
    const subtotal5 = subtotal4 - gastos;
    const subtotal6 = subtotal5 - efectivo;
    const verificacion = subtotal6 + propina + domicilio;
    const subtotalDocs = subtotalRed + transfer;
    const totalDocs = subtotalDocs + cxc;

    //Cierre de Caja
    const cierreCaja = domicilio + subtotal4 + transfer + cxc + baseCaja;
    const cierreCajaDividido = cierreCaja / 50000;

    let html = '';

    html += `<div class="titulo">CUADRE DE CAJA DIARIO</div>`;
    html += `<div class="linea"><div>Fecha:</div><div>${fecha}</div></div><hr>`;
    html += `<div class="linea"><div>Total Venta General:</div><div>${formatMoney(total)}</div></div>`;
    html += `<div class="linea"><div>Propina:</div><div>${formatMoney(propina)}</div></div>`;
    html += `<div class="linea"><div>Domicilio:</div><div>${formatMoney(domicilio)}</div></div>`;
    html += `<div class="linea bold"><div>VENTA TOTAL DEL DIA:</div><div>${formatMoney(subtotal1)}</div></div><hr>`;

    for (let i = 0; i < 6; i++) {
        html += `<div class="linea"><div>Red ${i + 1}:</div><div>${formatMoney(red[i])}</div></div>`;
    }

    html += `<div class="linea"><div>Subtotal:</div><div>${formatMoney(subtotal2)}</div></div><hr>`;
    html += `<div class="linea"><div>Transferencias:</div><div>${formatMoney(transfer)}</div></div>`;
    html += `<div class="linea"><div>Subtotal:</div><div>${formatMoney(subtotal3)}</div></div><hr>`;
    html += `<div class="linea"><div>Cuentas x Cobrar:</div><div>${formatMoney(cxc)}</div></div>`;
    html += `<div class="linea bold"><div>EFECTIVO ENTREGADO:</div><div>${formatMoney(subtotal4)}</div></div><hr>`;
    html += `<div class="linea"><div>Gastos:</div><div>${formatMoney(gastos)}</div></div>`;
    html += `<div class="linea"><div>Subtotal:</div><div>${formatMoney(subtotal5)}</div></div><hr>`;
    html += `<div class="linea"><div>Efectivo Oficina:</div><div>${formatMoney(efectivo)}</div></div>`;
    html += `<div class="linea"><div>Subtotal:</div><div>${formatMoney(subtotal6)}</div></div><hr>`;
    html += `<div class="linea"><div>Propina:</div><div>${formatMoney(propina)}</div></div>`;
    html += `<div class="linea"><div>Domicilio:</div><div>${formatMoney(domicilio)}</div></div>`;
    html += `<div class="linea bold"><div>Efectivo en caja:</div><div>${formatMoney(verificacion)}</div></div>`;

    html += `<br><hr><div style="text-align:center; font-weight:bold; margin-bottom:6px;">DOCUMENTOS</div>`;
    for (let i = 0; i < 6; i++) {
        html += `<div class="linea"><div>RED ${i + 1}:</div><div>${formatMoney(red[i])}</div></div>`;
    }

    html += `<div class="linea bold"><div>SUBTOTAL RED:</div><div>${formatMoney(subtotalRed)}</div></div>`;
    html += `<div class="linea"><div>TRANSFERENCIAS:</div><div>${formatMoney(transfer)}</div></div>`;
    html += `<div class="linea"><div>SUBTOTAL DOCS:</div><div>${formatMoney(subtotalDocs)}</div></div>`;
    html += `<div class="linea"><div>CUENTA X COBRAR:</div><div>${formatMoney(cxc)}</div></div>`;
    html += `<div class="linea bold"><div>TOTAL DOCUMENTOS:</div><div>${formatMoney(totalDocs)}</div></div>`;

    html += `<br><hr><div style="text-align:center; font-weight:bold; margin-bottom:6px;">DOMICILIOS</div><br>`;
    html += `<div class="linea"><div>Fecha:</div><div>${fecha}</div></div><br>`;
    html += `<div class="linea"><div>Domicilios:</div><div>${formatMoney(domicilio)}</div></div>`;

    html += `<br><hr><div style="text-align:center; font-weight:bold; margin-bottom:6px;">PROPINA</div><br>`;
    html += `<div class="linea"><div>Fecha:</div><div>${fecha}</div></div><br>`;
    html += `<div class="linea"><div>Propina:</div><div>${formatMoney(propina)}</div></div><br>`;
    html += `<div class="linea"><div>Repique:</div><div>__________</div></div><hr>`;
    html += `<div style="text-align:center; font-size:12px; margin-top:6px;">-- FIN DEL REPORTE --</div>`;

    html += `<div class="linea"><div>Repique:</div><div>__________</div></div> <br> <hr>`;
    //CIERRE DE CAJA
    html += `<br><br><div style="text-align:center; font-weight:bold; font-size:13px;">CIERRE DE CAJA DEL DÍA</div><hr>`;
    html += `<div class="linea"><div>Domicilios:</div><div>${formatMoney(domicilio)}</div></div>`;
    html += `<div class="linea"><div>Efectivo Entregado:</div><div>${formatMoney(subtotal4)}</div></div>`;
    html += `<div class="linea"><div>Transferencias:</div><div>${formatMoney(transfer)}</div></div>`;
    html += `<div class="linea"><div>Cuentas x Cobrar:</div><div>${formatMoney(cxc)}</div></div>`;
    html += `<div class="linea"><div>Base de Caja:</div><div>${formatMoney(baseCaja)}</div></div><hr>`;
    html += `<div class="linea bold"><div>TOTAL CIERRE DE CAJA:</div><div>${formatMoney(cierreCaja)}</div></div>`;
    html += `<div class="linea" style="flex-direction: column; align-items: flex-end; font-size:12px; margin-top:4px;">`;
    html += `<div>${formatMoney(cierreCaja)} ÷ ${formatMoney(50000)} = <b>${cierreCajaDividido.toFixed(1)}</b></div>`;
    html += `</div>`;

    document.getElementById('ticketContent').innerHTML = html;
    document.getElementById('reporteCompleto').style.display = 'block';
}
