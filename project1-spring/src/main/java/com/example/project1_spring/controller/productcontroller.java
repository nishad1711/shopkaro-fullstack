package com.example.project1_spring.controller;

import com.example.project1_spring.model.product;
import com.example.project1_spring.services.productservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class productcontroller {
    @Autowired
    productservice productservice;
    @RequestMapping("/")
    public String greeting(){
        return "Hello World";
    }
    @GetMapping("/products")
    public ResponseEntity<List<product>> getAllproducts(){ //response entitiy if yoo also want to pass pass status code as well
        return new ResponseEntity<>(productservice.getallproducts(), HttpStatus.OK);
    }
    @GetMapping("/product/{id}")
    public ResponseEntity<product> getproductbyid(@PathVariable int id){
        product product = productservice.getproductbyid(id);
        if(product == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productservice.getproductbyid(id), HttpStatus.OK);
    }
    @PostMapping("/product")
    public ResponseEntity<?> addproduct(
            @RequestPart("product") product product, // Key must match React formData "product"
            @RequestPart("file") MultipartFile file) { // Key must match React formData "file"
        try {
            product newproduct = productservice.addproduct(product, file);
            return new ResponseEntity<>(newproduct, HttpStatus.CREATED);
        } catch (Exception e) {
            // This will help you see the EXACT error in React if it still fails
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/product/{productid}/image")
    public ResponseEntity<byte[]> getimage(@PathVariable int productid){
        product product = productservice.getproductbyid(productid);
        if(product == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        byte[] image = product.getImagedata();
        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.valueOf(product.getImagetype()))
                .body(product.getImagedata());


    }
    @PutMapping("/product/{id}")
    public ResponseEntity<?> updateproduct(@PathVariable int id, @RequestPart("product") product product, @RequestPart("file") MultipartFile file) throws IOException {
        product updateproduct = productservice.updateproduct(id,product, file);
        if(updateproduct == null){
            return new ResponseEntity<>("failed-to-update",HttpStatus.BAD_REQUEST);
        }

            return new ResponseEntity<>("updated", HttpStatus.OK);

    }
    @DeleteMapping("/product/{id}")
    public ResponseEntity<?> deleteproduct(@PathVariable int id){
        product deleteproduct= productservice.deleteproductbyid(id);
        if(deleteproduct == null){
            return new ResponseEntity<>("No product is there for deleting",HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("deleted", HttpStatus.OK);
    }
    @GetMapping("/products/keyword")
    public ResponseEntity<List<product>> getproductbykeyword(@RequestParam("keyword") String keyword){
        List<product> products = productservice.getproductbykeyword(keyword);
        if(products == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(products, HttpStatus.OK);
    }




}
