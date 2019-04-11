const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'development') {
    

} else {
    const path = require('path');
    app.use(express.static(path.resolve(__dirname, 'dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`Server bound to ${PORT}`)
})