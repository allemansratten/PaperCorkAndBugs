export class ImageManager {

    private static images: Map<string, HTMLImageElement> = new Map<string, HTMLImageElement>()

    public static add(name: string, url: string) {
        let img = new Image()
        img.src = url
        ImageManager.images.set(name, img)
    }

    public static get(name: string) {
        if (!ImageManager.images.has(name)) {
            console.error("Image not found: " + name)
        }
        return ImageManager.images.get(name)
    }

    public static readonly ASSETS_DIR = "../assets/"

    public static readonly IMAGES_TO_LOAD = [
        ["cork", "cork.jpg"],
        ["eye1", "eye1.png"],
        ["paper1", "paper1.png"],
        ["leg1", "leg1.png"],
        ["arm1", "arm1.png"],
        ["ant", "ant.png"],
        ["ladybug", "ladybug.png"],
        ["fly", "fly.png"],
    ]

    public static loadAll() {
        this.IMAGES_TO_LOAD.forEach(imgPair => {
            ImageManager.add(imgPair[0], this.ASSETS_DIR + imgPair[1])
        })
    }
}
