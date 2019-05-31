const coffees = document.querySelector('.coffees');

document.addEventListener('DOMContentLoaded', function () {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {
        edge: 'right'
    });
    // add coffee form
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, {
        edge: 'left'
    });
});

// render the coffee data
const renderCoffee = (data, id) => {

    const html = `
        <div class="card-panel coffee white row" data-id=${id}>
            <img src="/img/coffee.png" alt="coffee thumb">
            <div class="coffee-details">
                <div class="coffee-title">
                    ${data.name}
                </div>
                <div class="coffee-ingredients">
                    <p>
                        ${data.description}
                    </p>
                    <p>
                        Ingredients: ${data.ingredients}
                    </p>
                </div>
            </div>
            <div class="coffee-delete">
                <i class="material-icons" data-id=${id}>delete_outline</i>
            </div>
        </div>
    `;

    coffees.innerHTML += html;
};