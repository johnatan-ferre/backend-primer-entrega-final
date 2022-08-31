const { promises: fs } = require('fs')

class ContenedorArchivo {

    constructor(ruta) {
        this.ruta = ruta;
    }

    async save(object) {
        let productLength = await this.getAll()
        if (productLength.length > 0) {
            try {
                let products = await this.getAll()
                let newLastProduct  = products[products.length - 1]. id + 1
                object.id = newLastProduct
                object.timestamp = Date.now()
                products.push(object)
                await fs.writeFile(this.ruta, JSON.stringify(products))
                return object.id
            }   catch (error) {
                throw new Error('Ocurrió un error y no se pudo guardar.')
            }
        } else {
            object.id = 1
            object.timestamp = Date.now()
            let newProduct = []
            newProduct.push(object)
            try {
                await fs.writeFile(this.ruta, JSON.stringify(newProduct))
                return object.id
            } catch (error) {
                throw new Error('Ocurrió un error y no se pudo guardar.')
            }
        }
        
    }

    async getAll() {
        try {
            let products = await fs.readFile(this.ruta, 'utf-8')
            return JSON.parse(products)
        } catch (error) {
            return []
        }
    }

    async getById(id) {
        const products = await this.getAll()
        let productById = products.find(product => product.id == id)
        return productById
    }


    async update(elem, id) {
        const item = await this.getAll()
        let productToUpdate = item.find(e => e.id === id)
        item[productToUpdate] = elem 
        await fs.writeFile(this.ruta, JSON.stringify(item))
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
}

module.exports = ContenedorArchivo