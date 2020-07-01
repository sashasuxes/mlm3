const toCurrency = minDeposit => {
  return new Intl.NumberFormat('ua-UA', {
    currency: 'UAH',
    style: 'currency'
  }).format(minDeposit)
}

const toDate = date => {
  return new Intl.DateTimeFormat('ua-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date))
}

document.querySelectorAll('.minDeposit').forEach(node => {
  node.textContent = toCurrency(node.textContent)
})

document.querySelectorAll('.date').forEach(node => {
  node.textContent = toDate(node.textContent)
})

const $cart = document.querySelector('#cart')
if ($cart) {
  $cart.addEventListener('click', event => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id
      const csrf = event.target.dataset.csrf

      fetch('/cart/remove/' + id, {
        method: 'delete',
        headers: {
          'X-XSRF-TOKEN': csrf
        },
      }).then(res => res.json())
        .then(cart => {
          if (cart.companies.length) {
            const html = cart.companies.map(c => {
              return `
              <tr>
                <td>${c.title}</td>
                <td>${c.count}</td>
                <td>
                  <button class="btn btm-small js-remove" data-id="${c.id}">Удалить</button>
                </td>
              </tr>
              `
            }).join('')
            $cart.querySelector('tbody').innerHTML = html
            $cart.querySelector('.minDeposit').textContent = toCurrency(cart.minDeposit)
          } else {
            $cart.innerHTML = '<p>Корзина пуста</p>'
          }
        })
    }

  })
}

M.Tabs.init(document.querySelectorAll('.tabs'))

