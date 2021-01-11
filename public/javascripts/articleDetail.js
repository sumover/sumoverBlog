$('img').each((index, element) => {
    element.id = `img-id-${index}`;

    element.onclick = () => {
        $('#img-modal').modal('show');
        $('#img-modal-body').html(
            `<img src="${element.src}" alt=${element.alt} style="height: 100%;width: 100%"> `)
        ;
        $('#img-modal-footer').text(element.alt);
    }
    console.log(`img ${index} catch from ${element.src}`);
    // var inHTML = $(this).html();
    // $(this).attr('onclick', `showModal(${inHTML})`)
});
$("table").each((index, element) => {
    element.class = "table table-bordered";
});
