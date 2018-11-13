
const HOUR_MS = 60 * 60 * 1000;
const PRICE_HOUR = 2.99;

const HOUR_MS_OVER_100 = HOUR_MS / 100;
const PRICE_HOUR_TIMES_100 = PRICE_HOUR * 100;

let rows;
let tableRef;
let buttonRef;
let errorRef;

buttonRef = document.querySelector('#refreshButton');
tableRef = document.querySelector('#transactionTable');
buttonRef.addEventListener('click', () => {
    refreshData();
});
refreshData();

function getEvent() {
    return axios.get('/api/event');
}

async function refreshData() {
    let response;
    try {
        response = await getEvent();
    } catch (error) {
        updateUI(null, error);
        return;
    }
    updateUI(response.data);
}

function updateUI(data, error) {
    if (error) {

        tableRef.classList.add('hidden');

        if (!errorRef) {
            errorRef = document.importNode(document.querySelector('#errorTemplate').content, true).querySelector('.error-display');
            document.body.appendChild(errorRef);
        }

    } else {

        if (errorRef) {
            errorRef.remove();
            delete errorRef;
        }

        tableRef.classList.remove('hidden');

        if (rows && rows.length) {
            for (let row of rows) {
                row.elementRef.remove();
            }
        }

        rows = [];

        data.sort((a, b) =>
            b.out > a.out
                ? 1
                : -1);

        for (let entry of data) {

            const durationRounded = Math.round((entry.out - entry.in) / HOUR_MS_OVER_100) / 100;
            const durationHours = (entry.out - entry.in) / HOUR_MS;
            const billableHours = Math.max(durationHours - 1, 0);
            const price = billableHours * PRICE_HOUR;
            const roundedPrice = Math.round(billableHours * PRICE_HOUR_TIMES_100) / 100

            const ref = document.querySelector('#transactionRowTemplate').content.cloneNode(true);
            ref.querySelector('.license-cell').innerHTML = entry.license;
            ref.querySelector('.in-cell').innerHTML = moment(entry.in).format('M/DD/YYYY H:mm:ss A');
            ref.querySelector('.out-cell').innerHTML = moment(entry.out).format('M/DD/YYYY H:mm:ss A');
            ref.querySelector('.duration-cell').innerHTML = durationRounded;
            ref.querySelector('.price-cell').innerHTML = `$${roundedPrice}`;

            const rowRef = ref.querySelector('.transaction-row');

            if (durationHours >= 24) {
                rowRef.classList.add('more-than-day-row')
            } else if (durationHours < 1) {
                rowRef.classList.add('less-than-hour-row')
            }

            tableRef.appendChild(ref);

            rows.push({
                durationHours,
                billableHours,
                price,
                entry,
                elementRef: rowRef
            });
        }

    }
}
