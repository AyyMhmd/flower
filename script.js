class EncryptedMessage {
    constructor() {
        this.charTable = [
            ...Array.from("!\"#$%&'()*+,-~./:;<=>?[\\]_{}"),
            ...Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
            ...Array.from("abcdefghijklmnopqrstuvwxyz"),
            ...Array.from("0123456789")
        ];

        this.menuElement = null;
        this.scrollIndicator = null;
        this.originalText = '';
        this.messageText = '';
        this.artText = '';
        this.encryptedDisplayText = '';
        this.promptText = '\n\nHit Enter To Decrypt...';
        this.isDecrypting = false;
        this.intervals = [];

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.menuElement = document.getElementById('menu');
        this.scrollIndicator = document.getElementById('scrollIndicator');

        if (!this.menuElement) {
            console.error('Required element not found');
            return;
        }

        // GANTI: Simpan bunga langsung di JS
        this.originalText = `
     
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⠀⠀⠀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⢠⠿⠷⣭⣶⣯⣥⣶⣾⣿⠀⠀⠀⠀⢠⠖⣒⡒⢢⣄⡴⠒⢢⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢸⠷⣾⣿⡀⢠⡿⠑⠀⠀⢸⣿⡿⡄⠀⠀⠀⢸⢼⣍⠙⠛⠙⢷⡀⠀⣷⠒⠈⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢸⣼⡟⣭⣻⢿⣧⡀⠀⣰⡿⠛⣫⣽⠀⠀⢠⠃⠈⢾⣄⠀⠀⢸⣷⡶⠓⢷⣄⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⡏⠀⠈⠀⠙⣿⣴⡿⠁⠀⠁⢸⠂⠀⢸⠀⠀⠀⢫⣆⣰⡟⠁⠀⠀⢈⣿⠃⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣷⠀⠀⠀⠀⠘⣿⡇⠀⠀⢀⡟⠀⠀⠘⡆⠀⠀⠀⣿⡏⠀⠀⠀⠀⣸⡏⠀⠀⣾⣿⣿⣿⣶⣾⡝⡆⣀⡀
⠀⠀⠀⠀⠀⢀⡠⣤⠤⡀⠈⢧⡀⠀⠀⠀⣻⡇⠀⣠⠞⠀⠀⠀⠀⠙⢄⡀⠀⣿⠁⠀⠀⠀⣰⠋⠀⠀⡰⣿⢿⣏⠀⠹⣷⣿⣿⣿⣿
⠀⠀⡞⠉⢱⡾⠾⠛⣷⠷⡀⠀⠙⠦⠤⢤⣿⣿⠟⠀⠀⠀⠀⠀⢀⣴⣀⠭⢶⣿⣤⣄⠤⠞⠁⠀⠀⠀⣿⣿⠎⢿⣦⣾⠟⠏⠾⣿⡇
⡖⢒⣇⡀⣿⠀⠀⢠⡟⠀⠘⡆⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⣠⣿⣿⡇⠀⢰⡏⠀⠈⠑⠢⣄⡀⠀⠀⢻⡹⠀⢸⡿⠁⠀⠂⣰⡟⠀
⠱⣼⠋⠉⠛⠷⣤⣼⠁⠀⠀⢱⠀⠀⠀⠀⠀⢹⡇⠀⠀⡠⢺⣿⣿⣿⡇⠀⣼⠇⠀⠀⠀⠀⠀⣭⠲⢄⡀⠙⢦⣼⣧⠄⢀⡴⠋⠀⠀
⠀⠻⣆⠀⠀⠀⠈⢻⡄⠀⢀⠆⠀⠀⠀⣰⡄⠘⣷⢀⡜⠁⣾⣿⣿⣿⡇⢀⡿⠀⠀⠀⣴⣧⢸⣿⣧⠀⠉⠲⢄⣿⠋⠉⠉⠀⠀⠀⠀
⠀⠀⠙⢦⡀⠀⠀⠀⣧⣴⠋⠀⠀⠀⢠⣿⣿⡄⢿⡎⠀⢸⣿⣿⣿⣿⡇⢸⡇⠀⢀⣾⣿⣿⣾⣿⣿⡇⠀⠀⢸⠏⠑⠢⣀⣤⡶⠀⠀
⠀⠀⠀⠀⠈⠁⠒⠈⠙⣯⠀⠀⠀⠀⣼⣿⣿⣿⣼⡇⠀⣿⣿⣿⣿⣿⠃⣾⠃⢀⣿⣿⣿⡇⣿⣿⣿⣧⠀⢀⡿⠀⢀⣴⣿⣿⡇⠀⠀
⠀⠀⠀⢀⣀⠀⠀⠀⠀⠘⣷⠀⠀⠀⣿⣿⣿⣿⣟⡇⢠⣿⣿⣿⣿⡟⢀⣿⢀⣾⣿⣿⣿⠇⢿⣿⣿⣿⠀⣸⠇⢠⣾⣿⣿⠏⢣⠀⠀
⠀⠀⠀⠈⢿⣿⣦⣄⠀⠀⠘⣧⠀⢀⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⡿⠁⢸⡏⣸⣿⣿⣿⡟⠀⠸⣿⣿⣿⢀⡿⢠⣿⣿⣿⠏⠀⠀⡇⠀
⠀⠀⠀⠀⠈⢿⣿⣿⣷⣄⠀⣸⣷⠉⣿⣿⣿⣿⣿⢹⣸⣿⣿⡿⠁⠀⢸⣇⣿⣿⣿⡟⠀⠀⠀⠹⣿⣿⣼⢧⣿⣿⠟⠁⢀⢔⡫⠆⠀
⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣄⠹⡆⢹⣿⣿⣿⡟⢸⣿⡿⠋⡀⠀⠀⣿⢹⣿⣿⠏⢀⣴⣿⠀⠀⠙⢿⣿⠛⠋⢁⡠⣺⠔⠉⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⠟⢿⣿⣿⣿⣧⣹⡜⣿⣿⣿⠇⢸⣧⠀⢰⣿⡀⠀⣿⠸⠟⠁⠀⣾⣿⡟⠀⠀⠀⢸⣇⡠⢖⡭⠊⠀⠀⠀⠀⡄⠀
⠀⠀⠀⠀⠀⠀⢾⠭⢒⡿⠿⢿⣿⣿⣿⣿⣿⠏⠀⠸⣿⠀⣿⣿⣷⢰⣿⠀⠀⠀⣼⣿⣿⠇⠀⢀⡤⣞⠭⠚⢹⠀⠀⠀⠀⠀⠀⠇⠀
⠀⠀⠀⠀⠀⠀⢸⡀⠀⠘⡏⠒⠪⠭⣛⡿⠯⣀⡀⠀⣿⠀⣿⣿⣿⣸⡿⠀⠀⢰⣿⣿⣿⠴⣪⠕⠊⠁⠀⠀⠚⠀⠀⠀⠀⠀⢀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⢳⠀⠀⠀⠀⠉⠑⢲⡪⠭⣛⡓⠿⢿⣿⣿⣇⠀⣀⠼⢛⡩⠒⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠈⣧⠀⠀⠀⠀⠀⠀⢣⠀⠀⠀⠉⢁⡐⠖⠈⠩⠔⠊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡎⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⡆⠀⠀⠘⣆⠀⠀⢀⡀⠠⠼⠓⠂⠩⠑⠒⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠇⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣀⡙⠂⠀⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢱⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⠀⠀⠀⠀⡇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠘⡄⠀⠀⠀⢸⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡎⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⡀⠀⠀⠀⢇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⠀⠀⠀⠀⡸⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢱⡀⠀⠀⠘⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⠀⠀⠀⠀⢠⠃⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢣⠀⠀⠘⣳⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡇⠀⠀⠀⢠⠃⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢇⠀⠀⢹⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡞⠀⠀⠀⣰⠃⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠆⠀⠀⢷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡸⠁⠀⠀⡰⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡄⠀⠘⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠃⠀⠀⡰⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠱⡀⠀⠹⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡏⠀⠀⡰⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⡄⠀⢱⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡿⠀⠀⡰⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢆⠀⢣⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢾⠃⠀⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢦⠈⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣨⠏⠀⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡶⠋⠉⠓⢦⣄⢣⡈⢧⠀⠀⠀⠀⠀⠀⠀⠀⢰⡛⠀⣰⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣦⣄⡀⠀⠙⢷⣷⠀⢧⠀⠀⠀⠀⠀⠀⢀⣣⡵⡾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠷⣦⣤⣹⣟⣈⣇⣀⡠⠤⠖⠛⠉⣁⣰⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠖⠋⣉⣽⠿⢻⣿⣧⣤⣤⡶⠶⠛⠋⠁⠘⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⠷⠶⠛⠉⠁⢀⣿⡞⣧⠐⠀⠀⠀⢸⢸⠀⠀⢣⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣜⡟⡇⢻⡆⠀⠀⠀⠀⠏⡄⠀⠘⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⠃⡇⠀⣿⠀⣀⠀⠀⠸⠃⠀⠀⢧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⠏⠀⠃⠀⢸⡇⢸⠀⠀⠀⢀⠀⠀⠸⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡾⠛⠦⣀⣀⠀⠀⡇⠈⡇⠀⠀⠈⡀⠀⢀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠚⠋⠀⠀⠀⠈⢸⠀⠀⢹⠀⢣⢀⡀⠤⠒⠊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠁⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`;

        this.messageText = this.originalText;
        this.setupScrollManagement();
        setTimeout(() => this.displayTerminal(), 1000);
    }

    setupScrollManagement() {
        this.checkContentOverflow();

        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.checkContentOverflow());

        document.addEventListener('keydown', (event) => this.handleKeyboardScroll(event));
    }

    checkContentOverflow() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        document.body.classList.toggle('show-scroll-indicator', documentHeight > windowHeight);
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        this.scrollIndicator.style.opacity = (scrollTop + windowHeight >= documentHeight - 50) ? '0' : '0.8';
    }

    handleKeyboardScroll(event) {
        if (this.isDecrypting || ['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return;

        const amount = 100;
        switch (event.key) {
            case 'ArrowDown': event.preventDefault(); window.scrollBy(0, amount); break;
            case 'ArrowUp': event.preventDefault(); window.scrollBy(0, -amount); break;
            case 'PageDown': event.preventDefault(); window.scrollBy(0, window.innerHeight * 0.8); break;
            case 'PageUp': event.preventDefault(); window.scrollBy(0, -window.innerHeight * 0.8); break;
            case 'Home': event.preventDefault(); window.scrollTo(0, 0); break;
            case 'End': event.preventDefault(); window.scrollTo(0, document.documentElement.scrollHeight); break;
        }
    }

    getRandomChar() {
        return this.charTable[Math.floor(Math.random() * this.charTable.length)];
    }

    encryptText(text) {
        return text.split('').map(char => (char === ' ' || char === '\n') ? char : this.getRandomChar()).join('');
    }

    showMenu() {
        this.menuElement.classList.remove('hidden');
        this.menuElement.classList.add('visible');
        setTimeout(() => this.checkContentOverflow(), 100);
    }

    displayCharacter(menuText, currentIndex = 0, decryptedText = '') {
        if (currentIndex >= menuText.length) {
            this.showDecryptPrompt(decryptedText);
            return;
        }

        this.menuElement.innerHTML = decryptedText + '<span class="cursor"></span>';
        decryptedText += menuText[currentIndex];
        currentIndex++;

        if (currentIndex % 50 === 0) this.autoScrollIfNeeded();

        setTimeout(() => this.displayCharacter(menuText, currentIndex, decryptedText), 10);
    }

    autoScrollIfNeeded() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop + windowHeight >= documentHeight - 200) {
            window.scrollTo({ top: documentHeight, behavior: 'smooth' });
        }
    }

    showDecryptPrompt(encryptedText) {
        this.encryptedDisplayText = encryptedText;
        this.typePrompt(encryptedText, this.promptText, 0);
    }

    typePrompt(baseText, promptText, currentIndex) {
        if (currentIndex >= promptText.length) {
            this.menuElement.innerHTML = baseText + promptText + '<span class="cursor"></span>';
            this.setupDecryptionListener();
            return;
        }

        const currentPrompt = promptText.substring(0, currentIndex + 1);
        this.menuElement.innerHTML = baseText + currentPrompt + '<span class="cursor"></span>';

        setTimeout(() => this.typePrompt(baseText, promptText, currentIndex + 1), 50);
    }

    setupDecryptionListener() {
        const trigger = () => {
            if (!this.isDecrypting) {
                this.isDecrypting = true;
                this.menuElement.textContent = this.encryptedDisplayText;
                this.randomizeText();
            }
        };

        document.addEventListener('keydown', e => (e.key === 'Enter') && trigger());
        this.menuElement.addEventListener('click', trigger);
        this.menuElement.addEventListener('touchend', trigger);
    }

    randomizeText() {
        let count = 0;
        const max = 100;
        const interval = setInterval(() => {
            if (count++ >= max) {
                clearInterval(interval);
                this.startDecryption();
                return;
            }
            this.menuElement.textContent = this.encryptText(this.originalText);
        }, 10);

        this.intervals.push(interval);
        setTimeout(() => {
            clearInterval(interval);
            this.startDecryption();
        }, 1000);
    }

    startDecryption() {
        const target = this.originalText;
        let current = this.menuElement.textContent;

        const decrypt = () => {
            if (current === target) {
                this.scrollToShowCompleteContent();
                return;
            }

            const indices = [];
            for (let i = 0; i < target.length; i++) {
                if (current[i] !== target[i]) indices.push(i);
            }

            if (indices.length > 0) {
                const i = indices[Math.floor(Math.random() * indices.length)];
                current = current.substring(0, i) + target[i] + current.substring(i + 1);
                this.menuElement.textContent = current;
                setTimeout(decrypt, 4);
            }
        };

        decrypt();
    }

    scrollToShowCompleteContent() {
        setTimeout(() => {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        }, 500);
    }

    displayTerminal() {
        const encryptedText = this.encryptText(this.originalText);
        this.showMenu();
        this.displayCharacter(encryptedText);
    }

    destroy() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
    }
}

const encryptedMessage = new EncryptedMessage();

window.addEventListener('beforeunload', () => {
    encryptedMessage.destroy();
});
