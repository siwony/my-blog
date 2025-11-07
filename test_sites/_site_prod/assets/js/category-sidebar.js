class CategorySidebar extends HTMLElement{constructor(){super(),this.categories=[],this.totalPosts=0}connectedCallback(){this.render();var t=this.getAttribute("categories-data"),s=this.getAttribute("total-posts");t&&this.setCategoriesData(t),s&&this.setTotalPosts(s)}static get observedAttributes(){return["categories-data","total-posts"]}attributeChangedCallback(t,s,a){"categories-data"===t&&a&&this.setCategoriesData(a),"total-posts"===t&&a&&this.setTotalPosts(a)}setCategoriesData(t){try{this.categories=JSON.parse(t),this.render()}catch(t){this.categories=[],this.render()}}setTotalPosts(t){this.totalPosts=parseInt(t,10)||0,this.render()}formatCategoryName(t){return t.split("-").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}createCategoryLink(t,s){return`
      <li class="category-item">
        <a href="${`/category/${t}/`}" class="category-link">
          <span class="category-name">${this.formatCategoryName(t)}</span>
          <span class="category-count">${s}</span>
        </a>
      </li>
    `}render(){var t;0===this.categories.length&&0===this.totalPosts?this.innerHTML=`
        <aside class="sidebar">
          <div class="category-navigation">
            <h3>Categories</h3>
            <ul class="category-list">
              <li class="category-item">Loading...</li>
            </ul>
            
            <div class="total-posts">
              <span class="total-label">Total Posts</span>
              <span class="total-count">0</span>
            </div>
          </div>
        </aside>
      `:(t=this.categories.sort((t,s)=>t.name.localeCompare(s.name)).map(t=>this.createCategoryLink(t.name,t.count)).join(""),this.innerHTML=`
      <aside class="sidebar">
        <div class="category-navigation">
          <h3>Categories</h3>
          <ul class="category-list">
            ${t||'<li class="category-item">No categories found</li>'}
          </ul>
          
          <div class="total-posts">
            <span class="total-label">Total Posts</span>
            <span class="total-count">${this.totalPosts}</span>
          </div>
        </div>
      </aside>
    `)}}customElements.define("category-sidebar",CategorySidebar);