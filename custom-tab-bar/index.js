Component({
    data: {
        selected: 0,
        color: "#7A7E83",
        selectedColor: "#6495ED",
        "list": [
            {
                "pagePath": "/pages/lost/lost",
                "iconPath": "/images/lost-no.png",
                "selectedIconPath": "/images/lost.png",
                "text": "我丢失"
            },
            {
                "pagePath": "/pages/add/add",
                "iconPath": "/images/add-no.png",
                "selectedIconPath": "/images/add.png",
                "text": "我捡到"
            },
            {
                "pagePath": "/pages/home/home",
                "iconPath": "/images/home-no.png",
                "selectedIconPath": "/images/home.png",
                "text": "我的"
            }
        ]
    },

    methods: {
        switchTab(e) {
            const data = e.currentTarget.dataset
            const url = data.path
            wx.switchTab({ url })
        }
    }
})