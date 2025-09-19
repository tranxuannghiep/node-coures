const templateModel = require("../models/template.model")
const { htmlEmailToken } = require("../utils/tem.html")


const newTemplate = async ({ tem_name }) => {
    try {

        const newTemplate = await templateModel.create({
            tem_name,
            tem_html: htmlEmailToken(),
            tem_id: Math.floor(Math.random() * 1000000)
        })

        return newTemplate

    } catch (error) {

    }
}

const getTemplate = async ({ tem_name }) => {
    try {


        const template = await templateModel.findOne({ tem_name }).lean()

        return template

    } catch (error) {

    }
}

module.exports = {
    newTemplate,
    getTemplate
}