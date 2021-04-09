function patch(id, status) {
  fetch('/issues/update-status/' + id, {
    method: 'PATCH',
    body: JSON.stringify({
      status: status,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((res) => {
    if (!res.ok) {
      alert("Can't update issue to " + status + ' status!');
    } else {
      location.reload();
    }
  });
}

const assignButtons = document.getElementsByClassName(
  'issues__issue__card__action--assign'
);
const closeButtons = document.getElementsByClassName(
  'issues__issue__card__action--close'
);
const assignButtonsArr = Array.from(assignButtons);
const closeButtonsArr = Array.from(closeButtons);

assignButtonsArr.concat(closeButtonsArr).forEach((element) => {
  element.addEventListener('click', () =>
    patch(element.dataset.id, element.dataset.status)
  );
});
