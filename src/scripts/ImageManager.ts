export class ImageManager {

    private static images: Map<string, HTMLImageElement> = new Map<string, HTMLImageElement>()

    public static add(name: string, url: string) {
        let img = new Image()
        img.src = url
        ImageManager.images.set(name, img)
    }

    public static get(name: string) {
        return ImageManager.images.get(name)
    }
}
