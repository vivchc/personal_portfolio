// To move preloader text
export default function (element) {
    element.style.overflow = 'hidden';
    // Takes each character in the text and convert to span
    element.innerHTML = element.innerText
        .split('')
        .map((char) => {
            if (char === ' ') {
                return `<span>&nbsp</span>`;
            }
            return `<span class="animatethis">${char}</span>`;
        })
        .join('');

    return element;
}
