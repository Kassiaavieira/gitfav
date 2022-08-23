import { githubUser } from "./githubUser.js"

// class que vai conter os dados do programa
export class Favorites {
    constructor (root) {
        this.root = document.querySelector(root)
        this.load()

    }
    delete(user){
        const entriesFiltered = this.entries.filter(entry => entry.login !== user.login)
        this.entries = entriesFiltered
        this.update()
        this.save()
    }
    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites')) || []
    }
    save(){
        localStorage.setItem('@github-favorites', JSON.stringify(this.entries))
    }
    async add(username){
        try {
            const userExists = this.entries.find(entry => entry.login.toUpperCase() === username.toUpperCase())
            if(userExists){
                throw new Error('Usuário Já cadastrado!')
            }

            const user = await githubUser.search(username)
            if(user.login == undefined){
                throw new Error('Usuário não Encontrado!')
            }
            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        }catch(error) {
            alert(error.message)
        }
        
    }
  

}


// class que vai conter a visualização e eventos do html
export class FavoritesView extends Favorites{
    constructor (root){
        super(root)
        this.tbody = this.root.querySelector('table tbody.fullUsers')
        this.tableEmpty = this.root.querySelector('.empty-table')
        this.update()
        this.onadd()

    }

    onadd(){
        const addButton = this.root.querySelector('.favoritar')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input')
            this.add(value)
        }
    }

    update(){
        this.notFavorites()
        
        this.removeAllTr()
    
        this.entries.forEach((user) => {
            const row = this.creatRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = "/" + user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers


            row.querySelector('.remove').onclick = () => {
                const isOk = confirm ("deseja deletar essa linha ?")
                if (isOk) {
                    this.delete(user)
                }
            }
            
            this.tbody.append(row)
        })

    }

    creatRow(){
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/maykbrito.png" alt="imagem de mayk brito">
                <a href="https://github.com/maykbrito" target="_blank">
                    <p>Mayk Brito</p>
                    <span>/maykbrito</span>
                </a>
            </td>
            <td class="repositories">
                123
            </td>
            <td class="followers">
                1234
            </td>
            <td>
                <button class="remove">Remover</button>
            </td>
        `
        return tr

    }
    
    removeAllTr(){
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }

    // verificando se o entries é maior ou igual a zero para esconder ou mostrar a segunda tabela com a imagem e o texto
    notFavorites(){
        if(this.entries.length == 0) {
            this.tableEmpty.classList.remove('hidden')
        }else if(this.entries.length >= 1){
            this.tableEmpty.classList.add('hidden') 
        }else{
            alert('error')
        }
    }


   
    
    
}