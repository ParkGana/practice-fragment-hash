import createRouter from './router.js';

const container = document.querySelector('main');

const pages = {
    home: () => {
        container.innerText = 'home page';
    },
    melon: () => {
        container.innerText = 'melon page';
    },
    detail: (params) => {
        container.innerText = `${params.name} ${params.song}`;
    }
};

const router = createRouter();

router.addRoute('#/', pages.home).addRoute('#/melon', pages.melon).addRoute('#/melon/:name/:song', pages.detail).start();

window.addEventListener('click', (e) => {
    if (e.target.matches('[data-navigate]')) {
        router.navigate(e.target.dataset.navigate);
    }
});
