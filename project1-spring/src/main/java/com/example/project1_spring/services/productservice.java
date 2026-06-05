package com.example.project1_spring.services;

import com.example.project1_spring.model.product;
import com.example.project1_spring.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class productservice {
    @Autowired
    private ProductRepo productRepo;

    public List<product> getallproducts(){
        return productRepo.findAll();
    }
    public product getproductbyid(int id){
        return productRepo.findById(id).orElse(null);
    }
    public product addproduct(product product1, MultipartFile imagefile) throws IOException {
        product1.setImagename(imagefile.getOriginalFilename());
       product1.setImagetype(imagefile.getContentType());
       product1.setImagedata(imagefile.getBytes());
       return productRepo.save(product1);
    }
    public product updateproduct(int id,product product1, MultipartFile imagefile) throws IOException {
        product1.setImagename(imagefile.getOriginalFilename());
        product1.setImagetype(imagefile.getContentType());
        product1.setImagedata(imagefile.getBytes());
        return productRepo.save(product1);
    }

    public product deleteproductbyid(int id) {
        product p1=productRepo.findById(id).orElse(null);
        productRepo.deleteById(id);
        return p1;

    }

    public List<product> getproductbykeyword(String keyword) {
        List<product> products= productRepo.searchProduct(keyword);
        return products;
    }
}
