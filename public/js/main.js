$(document).ready(() => {
  $('.delete-award').on('click', e => {
    $target = $(e.target)
    const id = $target.attr('data-id')
    $.ajax({
      type: 'DELETE',
      url: '/awards/' + id,
      success: res => {
        alert('Deleting Award')
        window.location.href = '/'
      },
      error: err => {
        console.log(err)
      }
    })
  })
})