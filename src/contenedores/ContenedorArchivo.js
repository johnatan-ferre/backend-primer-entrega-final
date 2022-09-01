const { promises: fs } = require('fs')

class ContenedorArchivo {
    constructor(ruta) {
        this.ruta = ruta;
    }

    async save(obj) {
        let productLength = await this.getAll()
        if (productLength.length > 0) {
            try {
                let products = await this.getAll()
                let newLastProduct  = products[products.length - 1].id + 1;
                obj.id = newLastProduct;
                obj.timestamp = Date.now()
                products.push(obj)
                await fs.writeFile(this.ruta, JSON.stringify(products))
                return obj.id
            } catch (error) {
                console.log('Ocurrió un error y no se pudo guardar.')
            }
        } else {
            obj.id = 1
            obj.timestamp = Date.now()
            let newProduct = []
            newProduct.push(obj)
            try {
                await fs.writeFile(this.ruta, JSON.stringify(newProduct))
                return obj.id
            } catch (error) {
                console.log('Ocurrió un error y no se pudo guardar.')
            }
        }
        
    }


    async getById(id) {
        const products = await this.getAll()
        let productById = products.find(prod => prod.id == id)
        return productById
    }

    async getAll() {
        try {
            let products = await fs.readFile(this.ruta, 'utf-8')
            return JSON.parse(products)
        } catch (error) {
            return []
        }
    }

    async deleteById(id) {
        let products = await this.getAll()
        let productToDelete = products.find(prod => prod.id === id)
        products.splice(productToDelete, 1)
        await fs.writeFile(this.ruta, JSON.stringify(products))
    }

    async deleteAll() {
        await fs.unlink(this.ruta)
    }

    async update(elem, id) {
        const item = await this.getAll()
        let productToUpdate = item.find(e => e.id === id)
        item[productToUpdate] = elem 
        await fs.writeFile(this.ruta, JSON.stringify(item))
    }
}

module.exports = ContenedorArchivo