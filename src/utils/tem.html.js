const htmlEmailToken = () => {
    return `
    <html>
        <head>
        </head>
        <body>
            <a href="{{link_verify}}">
                Verify
            </a>
        </body>
    </html>
    `
}

module.exports = {
    htmlEmailToken
}