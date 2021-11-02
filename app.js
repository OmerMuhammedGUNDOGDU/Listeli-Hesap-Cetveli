// ------------------- STORAGE CONTROLLER -------------------
const StorageController = (function () {

    return {
        
        storeProduct: function (product) {
            let products;
            if (localStorage.getItem('products') === null) {
                products = [];
                products.push(product);                
            } else {
                products = JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }
            localStorage.setItem('products', JSON.stringify(products));
        },
        getProducts: function(){
            let products;
            if(localStorage.getItem('products')==null){
                products=[];
            }else{
                products = JSON.parse(localStorage.getItem('products'));
            }
            return products;
        }
    }
})();


// ------------------- PRODUCT CONTROLLER ------------------- 

//(listedeki ürün bilgisini temsil edecek,bunlarla alakalı işlemleri yapacak )

const ProductController = (function () {
    //Private
    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    const data = {
        products: StorageController.getProducts(),
        selectedProduct: null,
        totalPrice: 0
    }

    //Public
    return {  //Private modülündeki verileri dışarı aktarmak için;

        getProducts: function () { //data içerisindeki product'ları geri getirecek,
            return data.products;
        },
        getData: function () { //data bilgisi geri gelecek
            return data;
        },

        getProductById: function (id) {
            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == id) {
                    product = prd;
                }
            })
            return product;
        },

        setCurrentProduct: function (product) {
            data.selectedProduct = product;
        },

        getCurrentProduct: function () {
            return data.selectedProduct;
        },

        addProduct: function (name, price) {
            let id;

            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1
            } else {
                id = 0;
            }

            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },

        updateProduct: function (name, price) {
            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }

            });
            return product;
        },

        deleteProduct: function (product) {

            data.products.forEach(function (prd, index) {
                if (prd.id == product.id) {
                    data.products.splice(index, 1);
                }
            })
        },

        getTotal: function () {
            let total = 0;
            data.products.forEach(function (item) {
                total += item.price; // hesaplanan değer total içerisine kaydedildi 
            });
            data.totalPrice = total; // hesaplanan değer totalPrice'e gönderildi
            return data.totalPrice;
        }
    }
})();


// ------------------- UI CONTROLLER -------------------

//(bilgilerimizi kullanıcıya gösterecek olan ve tamamen html etiketleriyle iletişime geçecek)
const UIController = (function () {

    const Selectors = { //butonlara ulaşabilmek için
        productList: '#item-list',
        productListItems: '#item-list tr',
        addButton: '.addBtn',
        updateButton: '.updateBtn',
        deleteButton: '.deleteBtn',
        cancelButton: '.cancelBtn',
        productName: '#productName',
        productPrice: '#productPrice',
        productCard: '#productCard',
        totalTL: '#total-tl',
        totalDolar: '#total-dolar'

    }

    return {
        createProductList: function (products) {

            let html = '';

            products.forEach(prd => { // her bir eleman prd objesinin içerisine sırasıyla gelsin

                html += `
                    <tr>
                        <td> ${prd.id} </td>
                        <td> ${prd.name} </td>
                        <td> ${prd.price} $ </td>
                        <td class="text-right">                        
                            <i class="far fa-edit edit-product"></i>                         
                    </td>
                    </tr > 
                    `;
            });

            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function () {
            return Selectors;
        },

        addProduct: function (prd) {

            document.querySelector(Selectors.productCard).style.display = 'block';

            var item = `
                <tr>
                    <td> ${prd.id} </td>
                    <td> ${prd.name} </td>
                    <td> ${prd.price} $ </td>
                    <td class="text-right">                        
                            <i class="far fa-edit edit-product"></i>                         
                    </td>
                </tr >            
            `;

            document.querySelector(Selectors.productList).innerHTML += item;
        },

        updateProduct: function (prd) {

            let updatedItem = null;

            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + '$';
                    updateItem = item;
                }

            });

            return updatedItem;

        },

        clearInputs: function () {
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';
        },

        clearWarnings: function () {
            const items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.classList.remove('bg-warning');
                }
            });
        },

        hideCard: function () {
            document.querySelector(Selectors.productCard).style.display = 'none'; //girilen verilerin listelendiği tabloda veri olmadığı zaman yapacağı
        },

        showTotal: function (total) {
            document.querySelector(Selectors.totalDolar).textContent = total;
            document.querySelector(Selectors.totalTL).textContent = total * 8; // Dolar cinsinden gelen parayı güncel kur ile çarparak TL ye çevirdik..
        },

        addProductToForm: function () {
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },

        deleteProduct: function () {

            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.remove();
                }
            });
        },

        addingState: function (item) {

            UIController.clearWarnings();

            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = 'inline'; //ekleme işlemi yapılacağı zaman bunun inline olması yeterli
            document.querySelector(Selectors.updateButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'none';
        },

        editState: function (tr) {

            tr.classList.add('bg-warning');
            document.querySelector(Selectors.addButton).style.display = 'none'; //güncelleme işlemi yapılacağı için ekleme butonu pasif yapıldı
            document.querySelector(Selectors.updateButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';
        }
    }

})();


// ------------------- APP CONTROLLER -------------------

//(Yukarıda oluşturulan ayrı modüllerin birleşiminden oluşan Ana Modül)
const App = (function (ProductCtrl, UICtrl, StorageCtrl) {  // 1. Adım - Parça modülleri Ana Modülde temsil edecek parametreler belirlendi 

    const UISelectors = UICtrl.getSelectors();

    //Load Event Listeners
    const loadEventListeners = function () {

        //add product event
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);

        //Edit Product Click
        document.querySelector(UISelectors.productList).addEventListener('click', productEditCLick);

        //Edit Product Submit
        document.querySelector(UISelectors.updateButton).addEventListener('click', editProductSubmit);

        // Cancel Button Click
        document.querySelector(UISelectors.cancelButton).addEventListener('click', cancelUpdate);

        //Delete Product
        document.querySelector(UISelectors.deleteButton).addEventListener('click', deleteProductSubmit);
    }

    const productAddSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            //Add Product
            const newProduct = ProductCtrl.addProduct(productName, productPrice);

            // Add İtem To List
            UIController.addProduct(newProduct);

            // Add Product To LS
            StorageCtrl.storeProduct(newProduct);

            //Get Total
            const total = ProductCtrl.getTotal(); //Girilen verilerin fiyatlarının toplamını bize getirsin

            //Show Total - Yapılan Hesabın Liste Üzerinde Gösterilmesi 
            UICtrl.showTotal(total);

            //Clear Inputs
            UIController.clearInputs();
        }
        console.log(productName, productPrice);

        e.preventDefault();
    }

    const productEditCLick = function (e) {

        if (e.target.classList.contains('edit-product')) {

            const id =
                e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            //get selected product
            const product = ProductCtrl.getProductById(id);

            //set current product
            ProductCtrl.setCurrentProduct(product);

            UICtrl.clearWarnings();

            // Add Product To UI
            UICtrl.addProductToForm();

            UICtrl.editState(e.target.parentNode.parentNode);
        }
        e.preventDefault();
    }

    const editProductSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {

            //Update Product
            const updateProduct = ProductCtrl.updateProduct(productName, productPrice);

            //Update UI
            let item = UICtrl.updateProduct(updateProduct);

            //Get Total
            const total = ProductCtrl.getTotal(); //Girilen verilerin fiyatlarının toplamını bize getirsin

            //Show Total - Yapılan Hesabın Liste Üzerinde Gösterilmesi 
            UICtrl.showTotal(total);

            UICtrl.addingState(); //güncelleme işlemi bittikten snr
        }
        e.preventDefault();
    }

    const cancelUpdate = function (e) {

        UICtrl.addingState();
        UICtrl.clearWarnings();

        e.preventDefault();
    }

    const deleteProductSubmit = function (e) {

        // Get Selected Product
        const selectedProduct = ProductCtrl.getCurrentProduct();

        // Delete Product
        ProductCtrl.deleteProduct(selectedProduct);

        // Delete UI
        UICtrl.deleteProduct();

        //Get Total
        const total = ProductCtrl.getTotal(); //Girilen verilerin fiyatlarının toplamını bize getirsin

        //Show Total - Yapılan Hesabın Liste Üzerinde Gösterilmesi 
        UICtrl.showTotal(total);

        UICtrl.addingState(); //güncelleme işlemi bittikten snr

        if (total == 0) { //Liste alanında eklenen verilerin hepsi silindiği zaman orada oluşan boş alanını kaldırdık
            UICtrl.hideCard();
        }
        e.preventDefault();
    }

    return {
        init: function () {
            console.log('starting app...');
            UICtrl.addingState();
            const products = ProductCtrl.getProducts();
            if (products.length == 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createProductList(products);
            }

            // Get Total
            const total = ProductCtrl.getTotal();
            
            // Show Total
            UICtrl.showTotal(total);

            //Load Event Listeners
            loadEventListeners()
        }
    }

})(ProductController, UIController, StorageController); // 2. Adım - Parça modullerin Ana module bağlantısı yapıldı

App.init();  //Artık uygulama çalışacak