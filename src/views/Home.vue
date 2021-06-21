<template>
  <div>
    <form @submit.prevent="addMessage" class="mb-3">
      <div v-if="error" class="alert alert-dismissible alert-warning">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <h4 class="alert-heading">Error!</h4>
        <p class="mb-0">{{error}}</p>
      </div>
      <div class="form-group">
        <label for="drive">Тип накопичувача:</label><br>
        <select v-model="message.driveType" name="drive" id="drive">
          <option value="HDD">HDD</option>
          <option value="Sata SSD 2.5">Sata SSD 2.5</option>
          <option value="SATA M2">SATA M2</option>
           <option value="NVME M2">NVME M2</option>
        </select>
      </div>
      <div class="form-group">
        <label for="memory">Тип пам'яті:</label><br>
        <select v-model="message.memoryType" name="memory" id="memory">
          <option value="DDR3 DIMM">DDR3 DIMM</option>
          <option value="DDR3 SO-DIMM">DDR3 SO-DIMM</option>
          <option value="DDR3L SO-DIMM"> DDR3L SO-DIMM</option>
          <option value="DDR4 DIMM">DDR4 DIMM</option>
          <option value="DDR4 SO-DIMM">DDR4 SO-DIMM</option>

        </select>
      </div>
      <div class="form-group">
        <label for="username">Кількість пам'яті</label>
        <input
          v-model="message.amount"
          type="text"
          class="form-control"
          id="username" required>
      </div>
      <div class="form-group">
        <label for="subject">Назва</label>
        <input
          v-model="message.name"
          type="text"
          class="form-control"
          id="subject"
          required>
      </div>
      <div class="form-group">
        <label for="message">Серійний номер</label>
        <textarea
          v-model="message.serial"
          class="form-control"
          id="message"
          rows="3"></textarea>
      </div>
      <div class="form-group">
        <label for="imageURL">Фото</label>
        <input
          v-model="message.imageURL"
          type="url"
          class="form-control"
          id="imageURL"
          >
      </div>
      <button type="submit">Створити</button>
    </form>
    <div class="list-unstyled" v-for="message in reversedMessages" :key="message._id">
      <li style="display: block" class="media">

        <div class="media-body">
          <img v-if="message.imageURL" class="mr-3" :src="message.imageURL" :alt="message.subject">
          <span>Назва: {{message.name}}</span>

          <span class="mt-0 mb-1">Тип накопичувача: {{message.driveType}}</span>
         <span>Серійний номер: {{message.serial}}</span>
        <span class="mt-0 mb-1">Тип пам'яті: {{message.memoryType}}</span>
         <span>Кількість пам'яті: {{message.amount}}</span>
          <small>Дата створення: {{message.created}}</small>
          <form @submit.prevent="deleteMessage(message._id)" class="mb-3" id="remove-message-form">
          <button class="x-button">Видалити елемент</button>
        </form>
        <form @submit.prevent="editMessage(message._id)" class="mb-3" id="remove-message-form">
          <button class="change-button">Змінити елемент</button>
        </form>
        </div>
      </li>
      <hr>
    </div>
  </div>
</template>

<script>
const API_URL = 'http://localhost:4000/messages';

export default {
  name: 'home',
  data: () => ({
    error: '',
    messages: [],
    message: {
      memoryType: 'Enter a screen name',
      driveType: '',
      serial: '',
      imageURL: '',
      name: '',
      amount: '',
    },
  }),
  computed: {
    reversedMessages() {
      return this.messages.slice().reverse();
    },
  },
  mounted() {
    fetch(API_URL)
      .then((response) => response.json())
      .then((result) => {
        this.messages = result;
      });
  },
  methods: {
    addMessage() {
      console.log(this.message);
      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(this.message),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.details) {
            // there was an error...
            const error = result.details
              .map((detail) => detail.message)
              .join('. ');
            this.error = error;
          } else {
            this.error = '';
            this.showMessageForm = false;
            this.messages.push(result);
          }
        });
    },
    deleteMessage(id) {
      fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.details) {
            // there was an error...
            const error = result.details
              .map((detail) => detail.message)
              .join('. ');
            this.error = error;
          } else {
            this.error = '';
            this.showMessageForm = false;
            this.messages = result;
          }
        });
    },
    editMessage(id) {
      this.$router.push(`edit/${id}`);
    },
  },
};
</script>

<style>
img {
  max-width: 50px;
  height: auto;
}
.form-group{
  width: 25%;
  margin: 0 auto;
}
.form-control{
  height: 25px;
}
textarea.form-control{
  height: 25px;
}
.btn-primary{
  background-color: rgb(38, 184, 104);
}
.media-body span{
  margin-right: 25px;
}
.x-button{
  margin-top: 5px;
}

element.style {
}

button, input, optgroup, select, textarea {
    font-family: Arial;
}
</style>
