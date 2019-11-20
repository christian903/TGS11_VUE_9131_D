<template>
    <v-container>
        <v-card>
            <v-container grid-list-md mb-0>
                <h2 class="text-md-center">Layanan Kendaraan</h2>
                <v-layout row wrap style="margin:10px">
                 <v-flex xs6>
                    <v-btn
                    depressed
                    dark
                    rounded
                    style="text-transform: none !important;"
                    color = "green accent-3"
                    @click="dialog = true"
                    >
                    <v-icon size="18" class="mr-2">mdi-pencil-plus</v-icon>
                        Tambah Kendaraan
                    </v-btn>
                </v-flex>
                <v-flex xs6 class="text-right">
                    <v-text-field
                        v-model="keyword"
                        append-icon="mdi-search"
                        label="Search"
                        hide-details
                    ></v-text-field>
                </v-flex>
                </v-layout>
                <v-data-table
                    :headers="headers"
                    :items="services"
                    :search="keyword"
                    :loading="load"
                >
                    <template v-slot:body="{ items }">
                        <tbody>
                            <tr v-for="(item,index) in items" :key="item.id">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.nama }}</td>
                                <td>{{ item.biaya}}</td>
                                <td>{{ item.jenis }}</td>
                                <td>{{ item.tanggal }}</td>
                                <td class="text-center">
                                    <v-btn
                                    icon
                                    color="indigo"
                                    light
                                    @click="editHandler(item)"
                                    >
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn
                                    icon
                                    color="error"
                                    light
                                    @click="deleteData(item.id)"
                                    >
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-data-table>
            </v-container>
        </v-card>
 <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
        <v-card-title>
            <span class="headline">Layanan Kendaraan</span>
        </v-card-title>
    <v-card-text>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-text-field label="Nama*" v-model="form.nama" required></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field label="Biaya*" v-model="form.biaya" required></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-select label="Jenis Kendaraan*" v-model="form.jenis" :items="items" required></v-select>
                </v-col>
                
            </v-row>
        </v-container>
        <small>*indicates required field</small>
    </v-card-text>
    <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="setForm()">Save</v-btn>
        </v-card-actions>
    </v-card>
 </v-dialog>
 <v-snackbar
    v-model="snackbar"
    :color="color"
    :multi-line="true"
    :timeout="3000"
 >
    {{ text }}
    <v-btn
    dark
    text
    @click="snackbar = false"
 >
    Close
 </v-btn>
 </v-snackbar>
 </v-container>
</template>
<script>
export default {
    data () {
        return {
            dialog: false,
            keyword: '',
            items:['ringan','sedang','berat'],
            headers: [
                {
                    text: 'No',
                    value: 'no',
                },
                {
                    text: 'Nama',
                    value: 'nama'
                },
                {
                    text: 'biaya',
                    value: 'biaya'
                },
                {
                    text: 'jenis',
                    value: 'jenis'
                },
                {
                    text: 'tanggal',
                    value: 'tanggal'
                },
                {
                    text: 'Aksi',
                    value: null
                },
            ],
            services: [],
            snackbar: false,
            color: null,
            text: '',
            load: false,
            form: {
            nama : '',
            biaya : 0,
            jenis : '',
            tanggal : ''
        },
        user : new FormData,
        typeInput: 'new',
        errors : '',
        updatedId : '',
    }
 },
 methods:{
    getData(){
        var uri = this.$apiUrl + '/layanan_kendaraan'
        this.$http.get(uri).then(response =>{
            this.services=response.data.message
        })
    },
 sendData(){
    this.user.append('nama', this.form.nama);
    this.user.append('biaya', this.form.biaya);
    this.user.append('jenis', this.form.jenis);
    this.user.append('tanggal', this.form.tanggal);
    var uri =this.$apiUrl + '/layanan_kendaraan'
    this.load = true
    this.$http.post(uri,this.user).then(response =>{
        this.snackbar = true; //mengaktifkan snackbar
        this.color = 'green'; //memberi warna snackbar
        this.text = response.data.message; //memasukkan pesan ke snackbar
        this.load = false;
        this.dialog = false
        this.getData(); //mengambil data user
        this.resetForm();
    }).catch(error =>{
        this.errors = error
        this.snackbar = true;
        this.text = 'Try Again';
        this.color = 'red';
        this.load = false;
    })
 },
 updateData(){
    this.user.append('nama', this.form.nama);
    this.user.append('biaya', this.form.biaya);
    this.user.append('jenis', this.form.jenis);
    this.user.append('tanggal', this.form.tanggal);
    var uri = this.$apiUrl + '/layanan_kendaraan/' + this.updatedId;
    this.load = true
    this.$http.post(uri,this.user).then(response =>{
    this.snackbar = true; //mengaktifkan snackbar
    this.color = 'green'; //memberi warna snackbar
    this.text = response.data.message; //memasukkan pesan ke snackbar
    this.load = false;
    this.dialog = false
    this.getData(); //mengambil data user
    this.resetForm();
    this.typeInput = 'new';
 }).catch(error =>{
    this.errors = error
    this.snackbar = true;
    this.text = 'Try Again';
    this.color = 'red';
    this.load = false;
    this.typeInput = 'new';
 })
 },
editHandler(item){
    this.typeInput = 'edit';
    this.dialog = true;
    this.form.nama = item.nama;
    this.form.biaya = item.biaya;
    this.form.jenis = item.jenis,
    this.updatedId = item.id
 },
 deleteData(deleteId){ //mengahapus data
    var uri = this.$apiUrl
+ '/layanan_kendaraan/' + deleteId; //data dihapus berdasarkan id
    this.$http.delete(uri).then(response =>{
        this.snackbar = true;
        this.text = response.data.message;
        this.color = 'green'
        this.deleteDialog = false;
        this.getData();
        }).catch(error =>{
        this.errors = error
        this.snackbar = true;
        this.text = 'Try Again';
        this.color = 'red';
    })
 },
 setForm(){
 if (this.typeInput === 'new') {
 this.sendData()
 } else {
 console.log("dddd")
 this.updateData()
 }
 },
 resetForm(){
 this.form = {
 name : '',
 biaya : 0,
 jenis : '',
 tanggal : ''
 }
 }
 },
 mounted(){
 this.getData();
 },
}
</script>