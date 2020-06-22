//Для синхронизации id между созданными синхроннымиьи моделями
AFRAME.registerComponent('target-id', {
    schema: {
        id: { default: 'none' },
    },
});
