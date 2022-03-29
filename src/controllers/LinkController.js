const Link = require('../model/Link')

class LinkController {
    // [POST] /short
    async shortLink(req, res) {
        try {
            const userId = req.body.userId
            const url = req.body.url
            let tailUrl = req.body.tailUrl

            if (!url || !tailUrl) {
                return res.status(202).json({ 
                    success: false,
                    url: "...", 
                    shortUrl: "..."
                 })
            }

            tailUrl = tailUrl.split(' ')
            tailUrl = tailUrl.join('')

            const checkTailUrl = await Link.findOne({ shortLink: tailUrl })

            if (checkTailUrl) {
                return res.status(202).json({ 
                    success: false,
                    url: url, 
                    shortUrl: "Link không hợp lệ"
                 })
            }

            if (userId) {
                const link = new Link({
                    oldLink: url,
                    shortLink: tailUrl,
                    userId: userId
                })
                await link.save()
            }
            else {
                const link = new Link({
                    oldLink: url,
                    shortLink: tailUrl,
                })
                await link.save()
            }

            tailUrl = `https://shortlink123.herokuapp.com/${tailUrl}`

            res.status(200).json({ url: url, shortUrl: tailUrl })
        }
        catch (err) {
            res.status(500).json(err)
        }
    }

    // [GET] //:url
    async accessShortUrl(req, res) {
        const shortUrl = req.params.url
        try {
            const link = await Link.findOne({ shortLink: shortUrl })

            if (link) {
                const count = link.click + 1
                const oldLink = link.oldLink
                await Link.findOneAndUpdate({ shortLink: shortUrl }, { $set: { click: count } })
                res.redirect(oldLink)
            }
            else {
                return res.redirect('https://shortlink123.netlify.app/')
            }
        }
        catch (err) {
            res.status(500).json(err)
        }
    }

    // [DEL] /:id 
    async delLink(req, res) {
        try {
            await Link.findByIdAndDelete(req.params.id)
            res.status(200).json("Link has been deleted")
        }
        catch (err) {
            res.status(500).json(err)
        }
    }

    // [GET] /link
    async getLink(req, res) {
        try {
            const userId = req.body.userId
            const listLink = await Link.find({ userId: userId })
            res.status(200).json(listLink)
        }
        catch (err) {
            res.status(500).json(err)
        }
    }
}

module.exports = new LinkController()